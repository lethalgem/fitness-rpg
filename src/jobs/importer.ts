// Background import job processor

import type { Env, ImportJob, User } from '../types';
import { createDbClient } from '../db/client';
import { UserRepository } from '../db/users';
import { ActivityRepository } from '../db/activities';
import { JobRepository } from '../db/jobs';
import { StravaAuth } from '../strava/auth';
import { StravaClient } from '../strava/client';
import { RateLimiter } from './rate-limiter';
import { log, error as logError } from '../utils/logger';

export class ImportJobProcessor {
  private dbClient;
  private userRepo;
  private activityRepo;
  private jobRepo;
  private rateLimiter;
  private stravaAuth;

  constructor(private env: Env) {
    this.dbClient = createDbClient(env);
    this.userRepo = new UserRepository(this.dbClient);
    this.activityRepo = new ActivityRepository(this.dbClient);
    this.jobRepo = new JobRepository(this.dbClient);
    this.rateLimiter = new RateLimiter(this.dbClient);
    this.stravaAuth = new StravaAuth(env);
  }

  // Process a single import job (fetch one page of activities)
  async processJob(job: ImportJob): Promise<{ completed: boolean; error?: string }> {
    try {
      log('Processing import job', { jobId: job.id, page: job.current_page });

      // Check rate limits
      const rateLimitCheck = await this.rateLimiter.canMakeRequest();
      if (!rateLimitCheck.allowed) {
        log('Rate limit reached, pausing job', { reason: rateLimitCheck.reason });
        await this.jobRepo.updateStatus(job.id, 'paused');
        return { completed: false, error: rateLimitCheck.reason };
      }

      // Get user and ensure valid token
      const user = await this.userRepo.findById(job.user_id);
      if (!user) {
        throw new Error(`User not found: ${job.user_id}`);
      }

      // Refresh token if needed
      const tokenInfo = await this.stravaAuth.ensureValidToken(
        user.access_token,
        user.refresh_token,
        user.expires_at
      );

      if (tokenInfo.refreshed) {
        await this.userRepo.updateTokens(
          user.id,
          tokenInfo.accessToken,
          tokenInfo.refreshToken,
          tokenInfo.expiresAt
        );
      }

      // Fetch activities for current page (with optional 'after' filter)
      const stravaClient = new StravaClient(tokenInfo.accessToken);
      const result = await stravaClient.getActivitiesPage(job.current_page, job.after_timestamp);

      // Record API request
      await this.rateLimiter.recordRequest();

      // Save activities to database
      if (result.activities.length > 0) {
        await this.activityRepo.batchUpsert(user.id, result.activities);

        // Update job progress
        const importedSoFar = job.imported_activities + result.activities.length;
        const lastActivityDate = result.activities[result.activities.length - 1]?.start_date;

        // Check if we're done
        if (!result.hasMore || result.activities.length === 0) {
          await this.jobRepo.updateProgress(
            job.id,
            importedSoFar,
            job.current_page + 1,
            lastActivityDate
          );
          await this.jobRepo.updateStatus(job.id, 'completed');
          log('Import job completed', { jobId: job.id });
          return { completed: true };
        }

        // More pages to fetch - update progress AND set back to pending in one go
        await this.jobRepo.updateProgressAndStatus(
          job.id,
          importedSoFar,
          job.current_page + 1,
          lastActivityDate,
          'pending'
        );

        log('Import progress updated', {
          jobId: job.id,
          imported: importedSoFar,
          page: job.current_page + 1,
        });

        return { completed: false };
      }

      // No activities on this page means we're done
      await this.jobRepo.updateStatus(job.id, 'completed');
      log('Import job completed', { jobId: job.id });
      return { completed: true };

    } catch (err) {
      logError('Import job failed', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      await this.jobRepo.updateStatus(job.id, 'failed', errorMessage);
      return { completed: false, error: errorMessage };
    }
  }

  // Create and start initial import for a new user
  async startInitialImport(user: User): Promise<ImportJob> {
    log('Starting initial import for user', { userId: user.id });

    // Check if there's already an active job for this user
    const existingJob = await this.jobRepo.findActiveByUserId(user.id);
    if (existingJob) {
      log('User already has an active import job, skipping', { userId: user.id, jobId: existingJob.id });
      return existingJob;
    }

    // Create import job
    const job = await this.jobRepo.create(user.id);

    // Mark as in progress
    await this.jobRepo.updateStatus(job.id, 'in_progress');

    // Fetch first page immediately (gives instant gratification)
    try {
      const stravaClient = new StravaClient(user.access_token);
      const result = await stravaClient.getActivitiesPage(1);

      await this.rateLimiter.recordRequest();

      if (result.activities.length > 0) {
        await this.activityRepo.batchUpsert(user.id, result.activities);
        await this.jobRepo.updateProgress(
          job.id,
          result.activities.length,
          2, // Next page is 2
          result.activities[result.activities.length - 1]?.start_date
        );
      }

      // If there are more activities, mark as pending for background processing
      if (result.hasMore) {
        await this.jobRepo.updateStatus(job.id, 'pending');
        log('Initial page imported, queued for background processing', { jobId: job.id });
      } else {
        await this.jobRepo.updateStatus(job.id, 'completed');
        log('All activities imported immediately', { jobId: job.id });
      }

    } catch (err) {
      logError('Initial import failed', err);
      await this.jobRepo.updateStatus(job.id, 'failed', err instanceof Error ? err.message : 'Unknown error');
    }

    return job;
  }
}
