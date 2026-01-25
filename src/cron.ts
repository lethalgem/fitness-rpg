// Cron worker for background job processing
// Triggered every 15 minutes by Cloudflare Workers cron

import type { Env } from './types';
import { createDbClient } from './db/client';
import { JobRepository } from './db/jobs';
import { ImportJobProcessor } from './jobs/importer';
import { RateLimiter } from './jobs/rate-limiter';
import { UserRepository } from './db/users';
import { ActivityRepository } from './db/activities';
import { UserStatsRepository } from './db/user-stats';
import { calculateUserStats } from './stats/calculator';
import { log, error as logError } from './utils/logger';

async function processImports(env: Env): Promise<void> {
  const dbClient = createDbClient(env);
  const jobRepo = new JobRepository(dbClient);
  const rateLimiter = new RateLimiter(dbClient);
  const processor = new ImportJobProcessor(env);

  // Clean up old rate limit records
  await rateLimiter.cleanup();

  // Find pending jobs
  const pendingJobs = await jobRepo.findPendingJobs(10); // Process up to 10 jobs
  log(`Found ${pendingJobs.length} pending jobs`);

  if (pendingJobs.length === 0) {
    log('No pending jobs to process');
    return;
  }

  // Process jobs sequentially (respecting rate limits)
  let processedCount = 0;
  let pausedCount = 0;
  let completedCount = 0;
  let failedCount = 0;

  for (let job of pendingJobs) {
    // Mark job as in progress
    await jobRepo.updateStatus(job.id, 'in_progress');

    // Keep processing pages for this job until complete or rate limited
    let jobCompleted = false;
    let pagesProcessed = 0;

    while (!jobCompleted) {
      // Check if we can still make requests
      const rateLimitCheck = await rateLimiter.canMakeRequest();
      if (!rateLimitCheck.allowed) {
        log('Rate limit reached, pausing job', {
          jobId: job.id,
          pagesProcessed,
          reason: rateLimitCheck.reason
        });
        await jobRepo.updateStatus(job.id, 'paused');
        pausedCount++;
        break;
      }

      // Process the next page
      const result = await processor.processJob(job);
      pagesProcessed++;

      if (result.completed) {
        jobCompleted = true;
        completedCount++;
        log('Job completed', { jobId: job.id, pagesProcessed });
      } else if (result.error) {
        if (result.error.includes('rate limit')) {
          await jobRepo.updateStatus(job.id, 'paused');
          pausedCount++;
        } else {
          failedCount++;
        }
        break;
      }

      // Reload job to get updated current_page for next iteration
      const reloadedJob = await jobRepo.findById(job.id);
      if (!reloadedJob) {
        log('Job not found after processing', { jobId: job.id });
        break;
      }
      job = reloadedJob;

      // Small delay between pages to be nice to Strava API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    processedCount++;
  }

  log('Cron job completed', {
    totalJobs: pendingJobs.length,
    processed: processedCount,
    completed: completedCount,
    paused: pausedCount,
    failed: failedCount,
  });
}

async function cacheAllUserStats(env: Env): Promise<void> {
  const dbClient = createDbClient(env);
  const userRepo = new UserRepository(dbClient);
  const activityRepo = new ActivityRepository(dbClient);
  const statsRepo = new UserStatsRepository(dbClient);

  log('Starting stats cache update');

  try {
    // Get all users
    const users = await userRepo.findAll();
    log(`Caching stats for ${users.length} users`);

    let successCount = 0;
    let errorCount = 0;

    // Calculate timestamp for start of current week (Monday 00:00:00 UTC)
    const { getStartOfWeek } = await import('./utils/time');
    const weekStartTimestamp = getStartOfWeek();

    // Update stats for each user
    for (const user of users) {
      try {
        // Get user's all-time activities
        const allActivities = await activityRepo.findByUserId(user.id, 10000);

        // Calculate all-time stats
        const allTimeStats = calculateUserStats(allActivities);

        // Cache all-time stats
        await statsRepo.upsertOverallStats(user.id, allTimeStats, 'all_time');

        // Get user's weekly activities (since Sunday 23:59 ET)
        const weeklyActivities = await activityRepo.findByUserIdSince(user.id, weekStartTimestamp, 10000);

        // Calculate weekly stats
        const weeklyStats = calculateUserStats(weeklyActivities);

        // Cache weekly stats
        await statsRepo.upsertOverallStats(user.id, weeklyStats, 'weekly');

        successCount++;
      } catch (err) {
        logError(`Failed to cache stats for user ${user.id}`, err);
        errorCount++;
      }
    }

    log('Stats cache update completed', {
      totalUsers: users.length,
      success: successCount,
      errors: errorCount,
    });
  } catch (err) {
    logError('Stats cache update failed', err);
    throw err;
  }
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    log('Cron job started', { scheduledTime: new Date(event.scheduledTime).toISOString() });

    try {
      // Process import jobs
      await processImports(env);

      // Cache user stats for leaderboards
      await cacheAllUserStats(env);
    } catch (err) {
      logError('Cron job failed', err);
      throw err;
    }
  },

  processImports,
  cacheAllUserStats,
};
