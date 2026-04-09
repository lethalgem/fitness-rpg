// Placements repository for weekly leaderboard medal tracking

import type { MedalCounts, WeeklyPlacement } from '../types';
import type { DatabaseClient } from './client';

export class PlacementsRepository {
  constructor(private db: DatabaseClient) {}

  async hasSnapshotForWeek(weekEnding: string): Promise<boolean> {
    const result = await this.db.first<{ found: number }>(
      `SELECT 1 as found FROM weekly_placements WHERE week_ending = ? LIMIT 1`,
      [weekEnding]
    );
    return result !== null;
  }

  async insertPlacement(
    weekEnding: string,
    category: string,
    placement: number,
    userId: number,
    statValue: number
  ): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.run(
      `INSERT INTO weekly_placements (week_ending, category, placement, user_id, stat_value, created_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(week_ending, category, placement) DO NOTHING`,
      [weekEnding, category, placement, userId, statValue, now]
    );
  }

  async incrementMedalCount(userId: number, category: string, placement: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const goldInc = placement === 1 ? 1 : 0;
    const silverInc = placement === 2 ? 1 : 0;
    const bronzeInc = placement === 3 ? 1 : 0;

    await this.db.run(
      `INSERT INTO medal_counts (user_id, category, gold, silver, bronze, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id, category) DO UPDATE SET
         gold = gold + excluded.gold,
         silver = silver + excluded.silver,
         bronze = bronze + excluded.bronze,
         updated_at = excluded.updated_at`,
      [userId, category, goldInc, silverInc, bronzeInc, now]
    );
  }

  async getMedalCountsForUsers(userIds: number[], category: string): Promise<Map<number, MedalCounts>> {
    if (userIds.length === 0) return new Map();

    const placeholders = userIds.map(() => '?').join(',');
    const rows = await this.db.all<{
      user_id: number;
      gold: number;
      silver: number;
      bronze: number;
    }>(
      `SELECT user_id, gold, silver, bronze
       FROM medal_counts
       WHERE user_id IN (${placeholders}) AND category = ?`,
      [...userIds, category]
    );

    const map = new Map<number, MedalCounts>();
    for (const row of rows) {
      map.set(row.user_id, {
        gold: row.gold,
        silver: row.silver,
        bronze: row.bronze,
      });
    }
    return map;
  }

  async getMedalCountsForUser(userId: number, category: string): Promise<MedalCounts | null> {
    const row = await this.db.first<{ gold: number; silver: number; bronze: number }>(
      `SELECT gold, silver, bronze FROM medal_counts WHERE user_id = ? AND category = ?`,
      [userId, category]
    );
    return row ? { gold: row.gold, silver: row.silver, bronze: row.bronze } : null;
  }

  async getWeeklyParticipantCount(category: string): Promise<number> {
    // Maps leaderboard category to the stat_type used in user_stats
    const statType = category === 'level' || category === 'activities' ? 'overall' : category;
    const result = await this.db.first<{ count: number }>(
      `SELECT COUNT(*) as count FROM user_stats
       WHERE stat_type = ? AND time_period = 'weekly' AND total_xp > 0`,
      [statType]
    );
    return result?.count ?? 0;
  }
}
