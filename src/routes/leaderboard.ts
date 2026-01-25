// Leaderboard API routes

import { Hono } from 'hono';
import type { Env } from '../types';
import { createDbClient } from '../db/client';
import { UserStatsRepository } from '../db/user-stats';
import { success, error } from '../utils/response';
import { log } from '../utils/logger';

const leaderboard = new Hono<{ Bindings: Env }>();

// GET /leaderboard?type=level&limit=100&offset=0&period=all_time
// Get global leaderboard by type (level, strength, endurance, agility, activities)
leaderboard.get('/', async (c) => {
  try {
    const type = c.req.query('type') || 'level';
    const limit = Math.min(parseInt(c.req.query('limit') || '100'), 100); // Max 100
    const offset = parseInt(c.req.query('offset') || '0');
    const period = c.req.query('period') || 'all_time'; // all_time or weekly

    const dbClient = createDbClient(c.env);
    const statsRepo = new UserStatsRepository(dbClient);

    let leaderboardData;

    switch (type) {
      case 'level':
        leaderboardData = await statsRepo.getLevelLeaderboard(limit, offset, period);
        break;
      case 'strength':
        leaderboardData = await statsRepo.getStatLeaderboard('strength', limit, offset, period);
        break;
      case 'endurance':
        leaderboardData = await statsRepo.getStatLeaderboard('endurance', limit, offset, period);
        break;
      case 'agility':
        leaderboardData = await statsRepo.getStatLeaderboard('agility', limit, offset, period);
        break;
      case 'activities':
        leaderboardData = await statsRepo.getActivityCountLeaderboard(limit, offset, period);
        break;
      default:
        return error('Invalid leaderboard type. Use: level, strength, endurance, agility, activities');
    }

    // Format the response with display names
    const formattedLeaderboard = leaderboardData.map((entry, index) => {
      const displayName = entry.username || `${entry.firstname || ''} ${entry.lastname || ''}`.trim() || 'Unknown User';

      return {
        rank: offset + index + 1,
        user_id: entry.user_id,
        name: displayName,
        firstname: entry.firstname,
        lastname: entry.lastname,
        profile_url: entry.profile_url,
        level: entry.level,
        total_xp: entry.total_xp,
        stat_value: entry.stat_value,
        activities_count: entry.activities_count,
      };
    });

    log('Fetched leaderboard', { type, count: formattedLeaderboard.length, limit, offset });

    return success({
      leaderboard: formattedLeaderboard,
      type,
      limit,
      offset,
    });
  } catch (err) {
    console.error('Failed to fetch leaderboard', err);
    return error('Failed to fetch leaderboard');
  }
});

// GET /leaderboard/sport?sport_type=Run&limit=100
// Get leaderboard for specific sport type
leaderboard.get('/sport', async (c) => {
  try {
    const sportType = c.req.query('sport_type');
    const limit = Math.min(parseInt(c.req.query('limit') || '100'), 100);

    if (!sportType) {
      return error('sport_type query parameter is required');
    }

    const dbClient = createDbClient(c.env);

    // Query for top users by activity count for this sport
    const results = await dbClient.all<{
      user_id: number;
      username?: string;
      firstname?: string;
      lastname?: string;
      profile_url?: string;
      activity_count: number;
      total_time: number;
      total_distance: number;
    }>(
      `SELECT
         u.id as user_id,
         u.username,
         u.firstname,
         u.lastname,
         u.profile_url,
         COUNT(a.id) as activity_count,
         SUM(a.moving_time) as total_time,
         SUM(a.distance) as total_distance
       FROM users u
       JOIN activities a ON u.id = a.user_id
       WHERE a.sport_type = ?
       GROUP BY u.id
       ORDER BY activity_count DESC, total_distance DESC
       LIMIT ?`,
      [sportType, limit]
    );

    const formattedLeaderboard = results.map((entry, index) => {
      const displayName = entry.username || `${entry.firstname || ''} ${entry.lastname || ''}`.trim() || 'Unknown User';

      return {
        rank: index + 1,
        user_id: entry.user_id,
        name: displayName,
        firstname: entry.firstname,
        lastname: entry.lastname,
        profile_url: entry.profile_url,
        activity_count: entry.activity_count,
        total_time: entry.total_time || 0,
        total_distance: entry.total_distance || 0,
      };
    });

    log('Fetched sport leaderboard', { sportType, count: formattedLeaderboard.length });

    return success({
      leaderboard: formattedLeaderboard,
      sport_type: sportType,
      limit,
    });
  } catch (err) {
    console.error('Failed to fetch sport leaderboard', err);
    return error('Failed to fetch sport leaderboard');
  }
});

// GET /leaderboard/sports - Get list of available sport types
leaderboard.get('/sports', async (c) => {
  try {
    const minActivities = parseInt(c.req.query('min_activities') || '5');
    const dbClient = createDbClient(c.env);

    const sports = await dbClient.all<{ sport_type: string; total_count: number }>(
      `SELECT
         sport_type,
         COUNT(*) as total_count
       FROM activities
       GROUP BY sport_type
       HAVING COUNT(*) >= ?
       ORDER BY total_count DESC`,
      [minActivities]
    );

    return success({ sports });
  } catch (err) {
    console.error('Failed to fetch sport types', err);
    return error('Failed to fetch sport types');
  }
});

// GET /leaderboard/me/:userId?type=level&period=all_time
// Get current user's rank in leaderboard
leaderboard.get('/me/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const type = c.req.query('type') || 'level';
    const period = c.req.query('period') || 'all_time';

    if (isNaN(userId)) {
      return error('Invalid user ID');
    }

    const dbClient = createDbClient(c.env);
    const statsRepo = new UserStatsRepository(dbClient);

    let rankData;

    switch (type) {
      case 'level':
        rankData = await statsRepo.getUserLevelRank(userId, period);
        break;
      case 'strength':
        rankData = await statsRepo.getUserStatRank(userId, 'strength', period);
        break;
      case 'endurance':
        rankData = await statsRepo.getUserStatRank(userId, 'endurance', period);
        break;
      case 'agility':
        rankData = await statsRepo.getUserStatRank(userId, 'agility', period);
        break;
      case 'activities':
        rankData = await statsRepo.getUserActivityRank(userId, period);
        break;
      default:
        return error('Invalid rank type. Use: level, strength, endurance, agility, activities');
    }

    if (!rankData) {
      return error('User stats not found. Stats may not be cached yet.');
    }

    log('Fetched user rank', { userId, type, period, rank: rankData.rank });

    return success({
      rank: rankData.rank,
      type,
      period,
      level: rankData.level,
      total_xp: rankData.total_xp,
      stat_value: rankData.stat_value,
      activities_count: rankData.activities_count,
    });
  } catch (err) {
    console.error('Failed to fetch user rank', err);
    return error('Failed to fetch user rank');
  }
});

// GET /leaderboard/reset-info
// Returns when the next weekly reset happens
leaderboard.get('/reset-info', async (c) => {
  try {
    const { getNextResetTime, getTimeUntilReset } = await import('../utils/time');

    const resetTimestamp = getNextResetTime();
    const timeUntilReset = getTimeUntilReset();

    return success({
      next_reset_timestamp: resetTimestamp,
      next_reset_iso: new Date(resetTimestamp * 1000).toISOString(),
      time_until_reset: timeUntilReset,
      reset_day: 'Sunday',
      reset_time: '11:59 PM ET',
      reset_timezone: 'America/New_York'
    });
  } catch (err) {
    console.error('Failed to fetch reset info', err);
    return error('Failed to fetch reset info');
  }
});

export default leaderboard;
