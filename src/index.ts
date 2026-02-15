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
import { createDbClient } from './db/client';
import { UserRepository } from './db/users';
import { ActivityRepository } from './db/activities';

const app = new Hono<{ Bindings: Env }>();

// Enable CORS
app.use('/*', cors());

// Show migration notice on old workers.dev domain
// Allow webhook endpoints through so Strava webhooks still work during transition
app.use('/*', async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname === 'fitness-rpg.iancashdeveloper.workers.dev') {
    if (url.pathname.startsWith('/webhooks/')) {
      return next();
    }
    const newUrl = new URL(c.req.url);
    newUrl.hostname = 'fitness-rpg.iancash.me';
    return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fitness RPG has moved!</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Fredoka', -apple-system, BlinkMacSystemFont, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%);
      color: #2d3748;
      overflow: hidden;
      position: relative;
    }
    .clouds {
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none;
      z-index: 0;
    }
    .cloud {
      position: absolute;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 100px;
      animation: float-cloud 30s infinite ease-in-out;
    }
    .cloud:nth-child(1) { width: 120px; height: 50px; top: 10%; left: -120px; animation-delay: 0s; }
    .cloud:nth-child(2) { width: 180px; height: 70px; top: 30%; left: -180px; animation-delay: 10s; }
    .cloud:nth-child(3) { width: 140px; height: 60px; top: 60%; left: -140px; animation-delay: 20s; }
    .cloud:nth-child(4) { width: 160px; height: 65px; top: 45%; left: -160px; animation-delay: 5s; }
    .cloud:nth-child(5) { width: 130px; height: 55px; top: 75%; left: -130px; animation-delay: 15s; }
    @keyframes float-cloud {
      0%, 100% { transform: translateX(0) translateY(0); }
      50% { transform: translateX(calc(100vw + 200px)) translateY(-20px); }
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 500px;
      position: relative;
      z-index: 1;
    }
    .title {
      font-size: 3rem;
      font-weight: 700;
      color: white;
      text-shadow: 3px 3px 0px rgba(0, 0, 0, 0.3);
      margin-bottom: 1.5rem;
      letter-spacing: 1px;
    }
    .card {
      background: rgba(100, 180, 255, 0.85);
      border: 4px solid rgba(255, 255, 255, 0.6);
      padding: 2.5rem;
      border-radius: 35px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
    }
    .card h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: white;
      text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.2);
      margin-bottom: 1rem;
    }
    .card p {
      font-size: 1.1rem;
      line-height: 1.6;
      color: rgba(255, 255, 255, 0.95);
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
      margin-bottom: 0.5rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: rgba(30, 100, 200, 0.7);
      border: 3px solid rgba(255, 255, 255, 0.5);
      border-radius: 18px;
      font-size: 1.1rem;
      font-weight: 700;
      font-family: 'Fredoka', sans-serif;
      color: white;
      text-decoration: none;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      margin-top: 1rem;
    }
    .btn:hover {
      background: rgba(30, 100, 200, 0.85);
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }
    .note {
      font-size: 0.9rem !important;
      color: rgba(255, 255, 255, 0.7) !important;
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="clouds">
    <div class="cloud"></div>
    <div class="cloud"></div>
    <div class="cloud"></div>
    <div class="cloud"></div>
    <div class="cloud"></div>
  </div>
  <div class="container">
    <div class="title">Fitness RPG</div>
    <div class="card">
      <h2>We've moved!</h2>
      <p>Fitness RPG has a new home. Please update your bookmarks!</p>
      <a href="${newUrl.toString()}" class="btn">Go to fitness-rpg.iancash.me</a>
      <p class="note">You'll be able to log in from the new site.</p>
    </div>
  </div>
</body>
</html>`);
  }
  return next();
});

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
