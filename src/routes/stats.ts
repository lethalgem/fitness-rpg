// Stats API routes

import { Hono } from 'hono';
import type { Env } from '../types';
import { createDbClient } from '../db/client';
import { UserRepository } from '../db/users';
import { ActivityRepository } from '../db/activities';
import { JobRepository } from '../db/jobs';
import { calculateUserStats, calculateStatsBySport } from '../stats/calculator';
import { xpForNextLevel, xpForCurrentLevel } from '../config/xp';
import { success, error, notFound } from '../utils/response';
import { log } from '../utils/logger';

const stats = new Hono<{ Bindings: Env }>();

// GET /stats/:userId - Get user stats
stats.get('/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));

    if (isNaN(userId)) {
      return error('Invalid user ID');
    }

    const dbClient = createDbClient(c.env);
    const userRepo = new UserRepository(dbClient);
    const activityRepo = new ActivityRepository(dbClient);
    const jobRepo = new JobRepository(dbClient);

    // Check if user exists
    const user = await userRepo.findById(userId);
    if (!user) {
      return notFound('User not found');
    }

    // Get all activities
    const activities = await activityRepo.findByUserId(userId, 10000); // Get all

    // Calculate stats
    const calculatedStats = calculateUserStats(activities);
    const sportBreakdown = calculateStatsBySport(activities);

    // Get import job status
    const activeJob = await jobRepo.findActiveByUserId(userId);

    // Calculate level progression
    const currentLevelXP = xpForCurrentLevel(calculatedStats.level);
    const nextLevelXP = xpForNextLevel(calculatedStats.level);
    const xpProgress = calculatedStats.total_xp - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;

    log('Fetched user stats', { userId, level: calculatedStats.level });

    return success({
      user: {
        id: user.id,
        strava_id: user.strava_id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        profile_url: user.profile_url,
      },
      stats: calculatedStats,
      level_progress: {
        current_level: calculatedStats.level,
        next_level: calculatedStats.level + 1,
        xp_progress: xpProgress,
        xp_needed: xpNeeded,
        percentage: Math.round((xpProgress / xpNeeded) * 100),
      },
      sport_breakdown: sportBreakdown,
      import_status: activeJob ? {
        job_id: activeJob.id,
        status: activeJob.status,
        imported: activeJob.imported_activities,
        total: activeJob.total_activities,
        percentage: activeJob.total_activities > 0
          ? Math.round((activeJob.imported_activities / activeJob.total_activities) * 100)
          : 0,
        dismissed: user.last_dismissed_job_id === activeJob.id,
      } : null,
    });

  } catch (err) {
    console.error('Failed to fetch stats', err);
    return error('Failed to fetch stats');
  }
});

// GET /stats/:userId/activities - Get recent activities
stats.get('/:userId/activities', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const limit = parseInt(c.req.query('limit') || '20');
    const offset = parseInt(c.req.query('offset') || '0');

    if (isNaN(userId)) {
      return error('Invalid user ID');
    }

    const dbClient = createDbClient(c.env);
    const activityRepo = new ActivityRepository(dbClient);

    const activities = await activityRepo.findByUserId(userId, limit, offset);
    const total = await activityRepo.countByUserId(userId);

    // Add XP and stat breakdown to each activity
    const { calculateActivityXP } = await import('../stats/xp');
    const { getStatMapping } = await import('../config/stats');

    const activitiesWithXP = activities.map(activity => {
      const xpCalc = calculateActivityXP(activity);
      const statMapping = getStatMapping(activity.sport_type);
      const strengthXP = Math.round(xpCalc.totalXP * statMapping.strength);
      const enduranceXP = Math.round(xpCalc.totalXP * statMapping.endurance);
      const agilityXP = Math.round(xpCalc.totalXP * statMapping.agility);

      return {
        ...activity,
        xp: {
          total: Math.round(xpCalc.totalXP),
          base: Math.round(xpCalc.baseXP),
          intensity_multiplier: xpCalc.intensityMultiplier,
          intensity_source: xpCalc.intensitySource,
          strength: strengthXP,
          endurance: enduranceXP,
          agility: agilityXP,
        },
      };
    });

    return success({
      activities: activitiesWithXP,
      pagination: {
        limit,
        offset,
        total,
        has_more: offset + activities.length < total,
      },
    });

  } catch (err) {
    console.error('Failed to fetch activities', err);
    return error('Failed to fetch activities');
  }
});

export default stats;
