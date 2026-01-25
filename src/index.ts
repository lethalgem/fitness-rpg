// Main Cloudflare Worker entry point

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from './types';
import auth from './routes/auth';
import stats from './routes/stats';
import friends from './routes/friends';
import leaderboard from './routes/leaderboard';
import webhooks from './routes/webhooks';
import cronHandler from './cron';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS
app.use('/*', cors());

// API routes
app.route('/auth', auth);
app.route('/stats', stats);
app.route('/friends', friends);
app.route('/leaderboard', leaderboard);
app.route('/webhooks', webhooks);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manual cron trigger (for testing)
app.get('/cron/trigger', async (c) => {
  // Run job in background using waitUntil so request returns immediately
  c.executionCtx.waitUntil(
    cronHandler.processImports(c.env).catch((error) => {
      console.error('Background cron job failed:', error);
    })
  );
  return c.json({ success: true, message: 'Cron job started in background' });
});

// Manual stats cache update trigger (for testing)
app.get('/cron/cache-stats', async (c) => {
  // Run job in background using waitUntil so request returns immediately
  c.executionCtx.waitUntil(
    cronHandler.cacheAllUserStats(c.env).catch((error) => {
      console.error('Background stats cache update failed:', error);
    })
  );
  return c.json({ success: true, message: 'Stats cache update started in background' });
});

// Debug endpoint to check weekly activities for a user
app.get('/debug/weekly-activities/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    if (isNaN(userId)) {
      return c.json({ error: 'Invalid user ID' }, 400);
    }

    const { createDbClient } = await import('./db/client');
    const { ActivityRepository } = await import('./db/activities');
    const { calculateUserStats } = await import('./stats/calculator');

    const dbClient = createDbClient(c.env);
    const activityRepo = new ActivityRepository(dbClient);

    // Calculate week start (Sunday 23:59 ET reset boundary)
    const { getStartOfWeek } = await import('./utils/time');
    const now = Math.floor(Date.now() / 1000);
    const weekStartTimestamp = getStartOfWeek();

    // Fetch weekly activities
    const weeklyActivities = await activityRepo.findByUserIdSince(userId, weekStartTimestamp, 10000);
    const allActivities = await activityRepo.findByUserId(userId, 10000);

    // Calculate stats
    const weeklyStats = calculateUserStats(weeklyActivities);
    const allTimeStats = calculateUserStats(allActivities);

    return c.json({
      now: new Date(now * 1000).toISOString(),
      weekStart: new Date(weekStartTimestamp * 1000).toISOString(),
      weeklyActivitiesCount: weeklyActivities.length,
      allTimeActivitiesCount: allActivities.length,
      weeklyActivities: weeklyActivities.map(a => ({
        id: a.id,
        sport_type: a.sport_type,
        name: a.name,
        start_date: a.start_date,
        moving_time: a.moving_time
      })),
      weeklyStats: {
        total_xp: weeklyStats.total_xp,
        strength: weeklyStats.strength,
        endurance: weeklyStats.endurance,
        agility: weeklyStats.agility,
        activities_count: weeklyStats.activities_count
      },
      allTimeStats: {
        total_xp: allTimeStats.total_xp,
        strength: allTimeStats.strength,
        endurance: allTimeStats.endurance,
        agility: allTimeStats.agility,
        activities_count: allTimeStats.activities_count
      }
    });
  } catch (err) {
    console.error('Debug endpoint failed', err);
    return c.json({ error: 'Failed to fetch debug info', details: String(err) }, 500);
  }
});

// Dismiss import job completion message
app.post('/dismiss-job/:userId/:jobId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const jobId = parseInt(c.req.param('jobId'));

    if (isNaN(userId) || isNaN(jobId)) {
      return c.json({ success: false, error: 'Invalid parameters' }, 400);
    }

    const { createDbClient } = await import('./db/client');
    const { UserRepository } = await import('./db/users');

    const dbClient = createDbClient(c.env);
    const userRepo = new UserRepository(dbClient);

    await userRepo.updateLastDismissedJobId(userId, jobId);

    return c.json({ success: true });
  } catch (err) {
    console.error('Dismiss job failed', err);
    return c.json({ success: false, error: 'Failed to dismiss job' }, 500);
  }
});

// Sync activities for a user
app.post('/sync/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    if (isNaN(userId)) {
      return c.json({ success: false, error: 'Invalid user ID' }, 400);
    }

    const { createDbClient } = await import('./db/client');
    const { UserRepository } = await import('./db/users');
    const { JobRepository } = await import('./db/jobs');
    const { ImportJobProcessor } = await import('./jobs/importer');

    const dbClient = createDbClient(c.env);
    const userRepo = new UserRepository(dbClient);
    const jobRepo = new JobRepository(dbClient);

    // Check if user exists
    const user = await userRepo.findById(userId);
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }

    // Check if there's already an active import job
    const activeJob = await jobRepo.findActiveByUserId(userId);
    if (activeJob && ['pending', 'in_progress', 'paused'].includes(activeJob.status)) {
      return c.json({
        success: false,
        error: 'An import is already in progress',
        job: activeJob
      }, 409);
    }

    // Get the most recent activity date to only fetch newer activities
    const { ActivityRepository } = await import('./db/activities');
    const activityRepo = new ActivityRepository(dbClient);
    const mostRecentActivity = await activityRepo.findMostRecent(userId);

    let afterTimestamp: number | undefined;
    if (mostRecentActivity?.start_date) {
      // Convert ISO date to epoch seconds and add 1 second to exclude the most recent activity
      afterTimestamp = Math.floor(new Date(mostRecentActivity.start_date).getTime() / 1000) + 1;
    }

    // Check if there are actually new activities before creating a job
    if (afterTimestamp) {
      // Refresh token if needed
      const needsRefresh = await userRepo.needsTokenRefresh(user);
      let accessToken = user.access_token;

      if (needsRefresh) {
        const { StravaAuth } = await import('./strava/auth');
        const stravaAuth = new StravaAuth(c.env);
        const tokenResponse = await stravaAuth.refreshToken(user.refresh_token);
        await userRepo.updateTokens(user.id, tokenResponse.access_token, tokenResponse.refresh_token, tokenResponse.expires_at);
        accessToken = tokenResponse.access_token;
      }

      // Do a quick check to see if there are any new activities
      const { StravaClient } = await import('./strava/client');
      const stravaClient = new StravaClient(accessToken);
      const checkActivities = await stravaClient.getActivities(1, 1, afterTimestamp);

      if (checkActivities.length === 0) {
        // No new activities, don't create a job
        return c.json({
          success: true,
          message: 'No new activities to sync',
          job: null
        });
      }
    }

    // Create new import job with 'after' filter
    const job = await jobRepo.create(userId, afterTimestamp);

    // Start processing immediately in the background (don't await)
    // The processImports function will handle all pages in a loop
    const processingPromise = cronHandler.processImports(c.env).catch((error) => {
      console.error('Background sync failed:', error);
    });

    // Keep the processing alive even after response is sent
    c.executionCtx.waitUntil(processingPromise);

    return c.json({
      success: true,
      message: 'Sync started',
      job: {
        id: job.id,
        status: job.status,
        imported: job.imported_activities
      }
    });

  } catch (err) {
    console.error('Sync endpoint failed', err);
    return c.json({ success: false, error: 'Failed to start sync' }, 500);
  }
});

// Serve static files (frontend)
app.get('/*', async (c) => {
  // Try to serve from assets binding
  if (c.env.ASSETS) {
    try {
      const assetResponse = await c.env.ASSETS.fetch(c.req.raw);
      if (assetResponse.status === 200) {
        return assetResponse;
      }
    } catch (e) {
      console.error('Asset fetch error:', e);
    }
  }

  // If root path and no assets, try to serve index.html directly
  const path = new URL(c.req.url).pathname;
  if (path === '/' && c.env.ASSETS) {
    try {
      const indexRequest = new Request(c.req.url.replace(/\/$/, '/index.html'), c.req.raw);
      const indexResponse = await c.env.ASSETS.fetch(indexRequest);
      if (indexResponse.status === 200) {
        return indexResponse;
      }
    } catch (e) {
      console.error('Index fetch error:', e);
    }
  }

  // Fallback message
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Fitness RPG</title>
        <style>
          body { font-family: sans-serif; text-align: center; padding: 50px; }
          a { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <h1>Fitness RPG</h1>
        <p>Frontend files not found. Deploying now...</p>
        <p><a href="/auth/strava/connect">Connect with Strava</a></p>
      </body>
    </html>
  `);
});

// Export handlers for different event types
export default {
  // HTTP requests
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx);
  },

  // Cron triggers
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    return cronHandler.scheduled(event, env, ctx);
  },
};
