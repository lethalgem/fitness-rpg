// User stats repository for caching calculated stats

import type { UserStats, CalculatedStats } from '../types';
import type { DatabaseClient } from './client';

export interface LeaderboardEntry {
  user_id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  profile_url?: string;
  level: number;
  total_xp: number;
  stat_value: number;
  activities_count: number;
}

export interface UserRank {
  rank: number;
  user_id: number;
  level: number;
  total_xp: number;
  stat_value: number;
  activities_count: number;
}

export class UserStatsRepository {
  constructor(private db: DatabaseClient) {}

  // Upsert user's overall cached stats
  async upsertOverallStats(userId: number, stats: CalculatedStats, timePeriod: string = 'all_time'): Promise<void> {
    const now = Math.floor(Date.now() / 1000);

    // Store overall stats in one row with stat_type = 'overall'
    await this.db.run(
      `INSERT INTO user_stats (user_id, stat_type, time_period, stat_value, total_xp, level, activities_count, updated_at)
       VALUES (?, 'overall', ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, stat_type, time_period) DO UPDATE SET
         stat_value = excluded.stat_value,
         total_xp = excluded.total_xp,
         level = excluded.level,
         activities_count = excluded.activities_count,
         updated_at = excluded.updated_at`,
      [userId, timePeriod, stats.total_xp, stats.total_xp, stats.level, stats.activities_count, now]
    );

    // Store individual stat XP values for stat-specific leaderboards
    // Using sequential inserts instead of transaction to avoid D1 constraint timing issues
    await this.db.run(
      `INSERT INTO user_stats (user_id, stat_type, time_period, stat_value, total_xp, level, activities_count, updated_at)
       VALUES (?, 'strength', ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, stat_type, time_period) DO UPDATE SET
         stat_value = excluded.stat_value,
         total_xp = excluded.total_xp,
         level = excluded.level,
         activities_count = excluded.activities_count,
         updated_at = excluded.updated_at`,
      [userId, timePeriod, stats.strength, stats.total_xp, stats.strength_level, stats.activities_count, now]
    );

    await this.db.run(
      `INSERT INTO user_stats (user_id, stat_type, time_period, stat_value, total_xp, level, activities_count, updated_at)
       VALUES (?, 'endurance', ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, stat_type, time_period) DO UPDATE SET
         stat_value = excluded.stat_value,
         total_xp = excluded.total_xp,
         level = excluded.level,
         activities_count = excluded.activities_count,
         updated_at = excluded.updated_at`,
      [userId, timePeriod, stats.endurance, stats.total_xp, stats.endurance_level, stats.activities_count, now]
    );

    await this.db.run(
      `INSERT INTO user_stats (user_id, stat_type, time_period, stat_value, total_xp, level, activities_count, updated_at)
       VALUES (?, 'agility', ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, stat_type, time_period) DO UPDATE SET
         stat_value = excluded.stat_value,
         total_xp = excluded.total_xp,
         level = excluded.level,
         activities_count = excluded.activities_count,
         updated_at = excluded.updated_at`,
      [userId, timePeriod, stats.agility, stats.total_xp, stats.agility_level, stats.activities_count, now]
    );
  }

  // Get cached stats for a user
  async getUserStats(userId: number, statType: string = 'overall'): Promise<UserStats | null> {
    return this.db.first<UserStats>(
      `SELECT * FROM user_stats WHERE user_id = ? AND stat_type = ?`,
      [userId, statType]
    );
  }

  // Get all cached stats for a user (all stat types)
  async getAllUserStats(userId: number): Promise<UserStats[]> {
    return this.db.all<UserStats>(
      `SELECT * FROM user_stats WHERE user_id = ? ORDER BY stat_type`,
      [userId]
    );
  }

  // Get top N users by overall level
  async getLevelLeaderboard(limit: number = 100, offset: number = 0, timePeriod: string = 'all_time'): Promise<LeaderboardEntry[]> {
    return this.db.all<LeaderboardEntry>(
      `SELECT
         us.user_id,
         u.username,
         u.firstname,
         u.lastname,
         u.profile_url,
         us.level,
         us.total_xp,
         us.stat_value,
         us.activities_count
       FROM user_stats us
       JOIN users u ON us.user_id = u.id
       WHERE us.stat_type = 'overall' AND us.time_period = ?
       ORDER BY us.level DESC, us.total_xp DESC
       LIMIT ? OFFSET ?`,
      [timePeriod, limit, offset]
    );
  }

  // Get top N users by specific stat (strength, endurance, agility)
  async getStatLeaderboard(
    statType: 'strength' | 'endurance' | 'agility',
    limit: number = 100,
    offset: number = 0,
    timePeriod: string = 'all_time'
  ): Promise<LeaderboardEntry[]> {
    return this.db.all<LeaderboardEntry>(
      `SELECT
         us.user_id,
         u.username,
         u.firstname,
         u.lastname,
         u.profile_url,
         us.level,
         us.total_xp,
         us.stat_value,
         us.activities_count
       FROM user_stats us
       JOIN users u ON us.user_id = u.id
       WHERE us.stat_type = ? AND us.time_period = ?
       ORDER BY us.level DESC, us.stat_value DESC
       LIMIT ? OFFSET ?`,
      [statType, timePeriod, limit, offset]
    );
  }

  // Get top N users by total activity count
  async getActivityCountLeaderboard(limit: number = 100, offset: number = 0, timePeriod: string = 'all_time'): Promise<LeaderboardEntry[]> {
    return this.db.all<LeaderboardEntry>(
      `SELECT
         us.user_id,
         u.username,
         u.firstname,
         u.lastname,
         u.profile_url,
         us.level,
         us.total_xp,
         us.stat_value,
         us.activities_count
       FROM user_stats us
       JOIN users u ON us.user_id = u.id
       WHERE us.stat_type = 'overall' AND us.time_period = ?
       ORDER BY us.activities_count DESC, us.level DESC
       LIMIT ? OFFSET ?`,
      [timePeriod, limit, offset]
    );
  }

  // Get user's rank by level
  async getUserLevelRank(userId: number): Promise<UserRank | null> {
    const result = await this.db.first<{ rank: number }>(
      `SELECT COUNT(*) + 1 as rank
       FROM user_stats us1
       WHERE us1.stat_type = 'overall'
         AND (us1.level > (SELECT level FROM user_stats WHERE user_id = ? AND stat_type = 'overall')
              OR (us1.level = (SELECT level FROM user_stats WHERE user_id = ? AND stat_type = 'overall')
                  AND us1.total_xp > (SELECT total_xp FROM user_stats WHERE user_id = ? AND stat_type = 'overall')))`,
      [userId, userId, userId]
    );

    if (!result) return null;

    const stats = await this.getUserStats(userId, 'overall');
    if (!stats) return null;

    return {
      rank: result.rank,
      user_id: userId,
      level: stats.level,
      total_xp: stats.total_xp,
      stat_value: stats.stat_value,
      activities_count: stats.activities_count,
    };
  }

  // Get user's rank by specific stat
  async getUserStatRank(userId: number, statType: 'strength' | 'endurance' | 'agility'): Promise<UserRank | null> {
    const result = await this.db.first<{ rank: number }>(
      `SELECT COUNT(*) + 1 as rank
       FROM user_stats us1
       WHERE us1.stat_type = ?
         AND (us1.level > (SELECT level FROM user_stats WHERE user_id = ? AND stat_type = ?)
              OR (us1.level = (SELECT level FROM user_stats WHERE user_id = ? AND stat_type = ?)
                  AND us1.stat_value > (SELECT stat_value FROM user_stats WHERE user_id = ? AND stat_type = ?)))`,
      [statType, userId, statType, userId, statType, userId, statType]
    );

    if (!result) return null;

    const stats = await this.getUserStats(userId, statType);
    if (!stats) return null;

    return {
      rank: result.rank,
      user_id: userId,
      level: stats.level,
      total_xp: stats.total_xp,
      stat_value: stats.stat_value,
      activities_count: stats.activities_count,
    };
  }

  // Get user's rank by activity count
  async getUserActivityRank(userId: number): Promise<UserRank | null> {
    const result = await this.db.first<{ rank: number }>(
      `SELECT COUNT(*) + 1 as rank
       FROM user_stats us1
       WHERE us1.stat_type = 'overall'
         AND (us1.activities_count > (SELECT activities_count FROM user_stats WHERE user_id = ? AND stat_type = 'overall')
              OR (us1.activities_count = (SELECT activities_count FROM user_stats WHERE user_id = ? AND stat_type = 'overall')
                  AND us1.level > (SELECT level FROM user_stats WHERE user_id = ? AND stat_type = 'overall')))`,
      [userId, userId, userId]
    );

    if (!result) return null;

    const stats = await this.getUserStats(userId, 'overall');
    if (!stats) return null;

    return {
      rank: result.rank,
      user_id: userId,
      level: stats.level,
      total_xp: stats.total_xp,
      stat_value: stats.stat_value,
      activities_count: stats.activities_count,
    };
  }

  // Delete all cached stats for a user
  async deleteUserStats(userId: number): Promise<void> {
    await this.db.run(`DELETE FROM user_stats WHERE user_id = ?`, [userId]);
  }
}
