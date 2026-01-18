// Activity database operations

import type { DatabaseClient } from './client';
import type { Activity, StravaSummaryActivity } from '../types';
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
    return this.db.all<Activity>(
      `SELECT * FROM activities
       WHERE user_id = ? AND strftime('%s', start_date) >= ?
       ORDER BY start_date DESC
       LIMIT ?`,
      [userId, sinceTimestamp, limit]
    );
  }

  async batchUpsert(userId: number, activities: StravaSummaryActivity[]): Promise<number> {
    if (activities.length === 0) return 0;

    const now = Math.floor(Date.now() / 1000);
    const statements: D1PreparedStatement[] = [];

    for (const activity of activities) {
      const stmt = this.db['db'].prepare(
        `INSERT INTO activities (
          user_id, strava_activity_id, name, sport_type,
          start_date, start_date_local, distance, moving_time,
          elapsed_time, total_elevation_gain, average_speed, max_speed,
          average_heartrate, max_heartrate, average_watts, max_watts,
          kilojoules, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
          kilojoules = excluded.kilojoules`
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
        now
      );

      statements.push(stmt);
    }

    await this.db.batch(statements);
    log(`Batch upserted ${activities.length} activities`, { userId });

    return activities.length;
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.db.run('DELETE FROM activities WHERE user_id = ?', [userId]);
    log('Deleted all activities for user', { userId });
  }
}
