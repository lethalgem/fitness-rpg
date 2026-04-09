// Activity database operations

import type { DatabaseClient } from './client';
import type { Activity, StravaSummaryActivity } from '../types';
import { calculateActivityXPBreakdown, type AggregatedXP } from '../stats/calculator';
import { log } from '../utils/logger';

export class ActivityRepository {
  constructor(private db: DatabaseClient) {}

  async findByStravaId(stravaActivityId: string): Promise<Activity | null> {
    return this.db.first<Activity>(
      'SELECT * FROM activities WHERE strava_activity_id = ?',
      [stravaActivityId]
    );
  }

  async findByUserId(userId: number, limit = 100, offset = 0): Promise<Activity[]> {
    return this.db.all<Activity>(
      'SELECT * FROM activities WHERE user_id = ? ORDER BY start_date DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );
  }

  async findMostRecent(userId: number): Promise<Activity | null> {
    return this.db.first<Activity>(
      'SELECT * FROM activities WHERE user_id = ? ORDER BY start_date DESC LIMIT 1',
      [userId]
    );
  }

  async countByUserId(userId: number): Promise<number> {
    const result = await this.db.first<{ count: number }>(
      'SELECT COUNT(*) as count FROM activities WHERE user_id = ?',
      [userId]
    );
    return result?.count || 0;
  }

  async findByUserIdSince(userId: number, sinceTimestamp: number, limit: number = 10000): Promise<Activity[]> {
    // Convert Unix timestamp to ISO 8601 string for direct comparison
    // SQLite can compare ISO 8601 strings directly
    const sinceDate = new Date(sinceTimestamp * 1000).toISOString();
    return this.db.all<Activity>(
      `SELECT * FROM activities
       WHERE user_id = ? AND start_date >= ?
       ORDER BY start_date DESC
       LIMIT ?`,
      [userId, sinceDate, limit]
    );
  }

  async batchUpsert(userId: number, activities: StravaSummaryActivity[]): Promise<number> {
    if (activities.length === 0) return 0;

    const now = Math.floor(Date.now() / 1000);
    const statements: D1PreparedStatement[] = [];

    for (const activity of activities) {
      // Pre-calculate XP at import time so stats can use SQL SUM
      const xp = calculateActivityXPBreakdown(activity);

      const stmt = this.db['db'].prepare(
        `INSERT INTO activities (
          user_id, strava_activity_id, name, sport_type,
          start_date, start_date_local, distance, moving_time,
          elapsed_time, total_elevation_gain, average_speed, max_speed,
          average_heartrate, max_heartrate, average_watts, max_watts,
          kilojoules, suffer_score, total_xp, strength_xp, endurance_xp, agility_xp, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(strava_activity_id) DO UPDATE SET
          name = excluded.name,
          sport_type = excluded.sport_type,
          start_date = excluded.start_date,
          start_date_local = excluded.start_date_local,
          distance = excluded.distance,
          moving_time = excluded.moving_time,
          elapsed_time = excluded.elapsed_time,
          total_elevation_gain = excluded.total_elevation_gain,
          average_speed = excluded.average_speed,
          max_speed = excluded.max_speed,
          average_heartrate = excluded.average_heartrate,
          max_heartrate = excluded.max_heartrate,
          average_watts = excluded.average_watts,
          max_watts = excluded.max_watts,
          kilojoules = excluded.kilojoules,
          suffer_score = excluded.suffer_score,
          total_xp = excluded.total_xp,
          strength_xp = excluded.strength_xp,
          endurance_xp = excluded.endurance_xp,
          agility_xp = excluded.agility_xp`
      ).bind(
        userId,
        activity.id.toString(),
        activity.name || null,
        activity.sport_type || 'Unknown',
        activity.start_date || null,
        activity.start_date_local || null,
        activity.distance || null,
        activity.moving_time || null,
        activity.elapsed_time || null,
        activity.total_elevation_gain || null,
        activity.average_speed || null,
        activity.max_speed || null,
        activity.average_heartrate || null,
        activity.max_heartrate || null,
        activity.average_watts || null,
        activity.max_watts || null,
        activity.kilojoules || null,
        activity.suffer_score || null,
        xp.total_xp,
        xp.strength_xp,
        xp.endurance_xp,
        xp.agility_xp,
        now
      );

      statements.push(stmt);
    }

    await this.db.batch(statements);
    log(`Batch upserted ${activities.length} activities`, { userId });

    return activities.length;
  }

  // Aggregate pre-calculated XP using SQL SUM (avoids loading all activities into JS)
  async getAggregatedStats(userId: number): Promise<AggregatedXP> {
    const result = await this.db.first<AggregatedXP>(
      `SELECT
        COALESCE(SUM(total_xp), 0) as total_xp,
        COALESCE(SUM(strength_xp), 0) as strength_xp,
        COALESCE(SUM(endurance_xp), 0) as endurance_xp,
        COALESCE(SUM(agility_xp), 0) as agility_xp,
        COUNT(*) as activities_count
      FROM activities WHERE user_id = ?`,
      [userId]
    );
    return result || { total_xp: 0, strength_xp: 0, endurance_xp: 0, agility_xp: 0, activities_count: 0 };
  }

  async getAggregatedStatsSince(userId: number, sinceTimestamp: number): Promise<AggregatedXP> {
    const sinceDate = new Date(sinceTimestamp * 1000).toISOString();
    const result = await this.db.first<AggregatedXP>(
      `SELECT
        COALESCE(SUM(total_xp), 0) as total_xp,
        COALESCE(SUM(strength_xp), 0) as strength_xp,
        COALESCE(SUM(endurance_xp), 0) as endurance_xp,
        COALESCE(SUM(agility_xp), 0) as agility_xp,
        COUNT(*) as activities_count
      FROM activities WHERE user_id = ? AND start_date >= ?`,
      [userId, sinceDate]
    );
    return result || { total_xp: 0, strength_xp: 0, endurance_xp: 0, agility_xp: 0, activities_count: 0 };
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.db.run('DELETE FROM activities WHERE user_id = ?', [userId]);
    log('Deleted all activities for user', { userId });
  }

  async deleteByStravaId(stravaActivityId: string): Promise<void> {
    await this.db.run('DELETE FROM activities WHERE strava_activity_id = ?', [stravaActivityId]);
    log('Deleted activity by Strava ID', { stravaActivityId });
  }
}
