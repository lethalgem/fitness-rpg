// Strava Webhook API routes

import { Hono } from 'hono';
import type { Env } from '../types';
import { success, error } from '../utils/response';
import { log } from '../utils/logger';
import { StravaClient } from '../strava/client';
import { StravaAuth } from '../strava/auth';
import { createDbClient } from '../db/client';
import { UserRepository } from '../db/users';
import { ActivityRepository } from '../db/activities';
import { UserStatsRepository } from '../db/user-stats';
import { calculateUserStats } from '../stats/calculator';

const webhooks = new Hono<{ Bindings: Env }>();

// GET /webhooks/strava - Verification endpoint
// Strava sends: hub.mode, hub.challenge, hub.verify_token
webhooks.get('/strava', async (c) => {
  try {
    const mode = c.req.query('hub.mode');
    const challenge = c.req.query('hub.challenge');
    const verifyToken = c.req.query('hub.verify_token');

    log('Webhook verification request', { mode, verifyToken });

    // Verify token matches
    if (verifyToken !== c.env.STRAVA_WEBHOOK_VERIFY_TOKEN) {
      return error('Invalid verify token', 403);
    }

    // Echo challenge back
    return c.json({ 'hub.challenge': challenge });
  } catch (err) {
    console.error('Webhook verification failed', err);
    return error('Verification failed', 400);
  }
});

// POST /webhooks/strava - Event handler
webhooks.post('/strava', async (c) => {
  try {
    const event = await c.req.json();

    log('Webhook event received', {
      objectType: event.object_type,
      aspectType: event.aspect_type,
      objectId: event.object_id,
      ownerId: event.owner_id,
    });

    // Acknowledge immediately (must respond in < 2 seconds)
    // Process in background using waitUntil
    c.executionCtx.waitUntil(
      processWebhookEvent(c.env, event).catch((error) => {
        console.error('Background webhook processing failed', error);
      })
    );

    return success({ message: 'Event received' });
  } catch (err) {
    console.error('Webhook handler error', err);
    return error('Failed to process event', 500);
  }
});

async function processWebhookEvent(env: Env, event: any): Promise<void> {
  const { object_type, aspect_type, object_id, owner_id } = event;

  // Only handle activity events
  if (object_type !== 'activity') {
    if (object_type === 'athlete' && aspect_type === 'deauthorize') {
      log('User deauthorized', { stravaId: owner_id });
      // TODO: Mark user as deauthorized or delete
    }
    return;
  }

  const dbClient = createDbClient(env);
  const userRepo = new UserRepository(dbClient);
  const activityRepo = new ActivityRepository(dbClient);
  const statsRepo = new UserStatsRepository(dbClient);

  // Find user by Strava ID
  const user = await userRepo.findByStravaId(owner_id.toString());
  if (!user) {
    log('User not found for webhook event', { stravaId: owner_id });
    return;
  }

  if (aspect_type === 'delete') {
    // Delete activity from database
    await activityRepo.deleteByStravaId(object_id.toString());
    log('Activity deleted', { activityId: object_id, userId: user.id });

    // Recalculate stats
    await updateUserStats(env, user.id);
    return;
  }

  if (aspect_type === 'create' || aspect_type === 'update') {
    // Ensure token is valid
    const stravaAuth = new StravaAuth(env);
    const tokenInfo = await stravaAuth.ensureValidToken(user);

    if (tokenInfo.refreshed) {
      await userRepo.updateTokens(
        user.id,
        tokenInfo.accessToken,
        tokenInfo.refreshToken,
        tokenInfo.expiresAt
      );
    }

    // Fetch full activity details from Strava
    const stravaClient = new StravaClient(tokenInfo.accessToken);
    const activity = await stravaClient.getActivity(object_id);

    // Import to database
    await activityRepo.batchUpsert(user.id, [activity]);
    log('Activity imported from webhook', {
      activityId: object_id,
      userId: user.id,
      aspectType: aspect_type,
    });

    // Update stats
    await updateUserStats(env, user.id);
  }
}

async function updateUserStats(env: Env, userId: number): Promise<void> {
  const dbClient = createDbClient(env);
  const activityRepo = new ActivityRepository(dbClient);
  const statsRepo = new UserStatsRepository(dbClient);

  // Get all activities
  const allActivities = await activityRepo.findByUserId(userId, 10000);

  // Calculate all-time stats
  const allTimeStats = calculateUserStats(allActivities);
  await statsRepo.upsertOverallStats(userId, allTimeStats, 'all_time');

  // Calculate weekly stats (using Sunday 23:59 ET reset boundary)
  const { getStartOfWeek } = await import('../utils/time');
  const weekStartTimestamp = getStartOfWeek();
  const weeklyActivities = await activityRepo.findByUserIdSince(userId, weekStartTimestamp, 10000);
  const weeklyStats = calculateUserStats(weeklyActivities);
  await statsRepo.upsertOverallStats(userId, weeklyStats, 'weekly');

  log('Stats updated from webhook', { userId });
}

export default webhooks;
