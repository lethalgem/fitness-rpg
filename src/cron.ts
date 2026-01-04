// Cron worker for background job processing
// Triggered every 15 minutes by Cloudflare Workers cron

import type { Env } from './types';
import { createDbClient } from './db/client';
import { JobRepository } from './db/jobs';
import { ImportJobProcessor } from './jobs/importer';
import { RateLimiter } from './jobs/rate-limiter';
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

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    log('Cron job started', { scheduledTime: new Date(event.scheduledTime).toISOString() });

    try {
      await processImports(env);
    } catch (err) {
      logError('Cron job failed', err);
      throw err;
    }
  },

  processImports,
};
