// Strava API rate limit tracking

import type { DatabaseClient } from '../db/client';
import { log } from '../utils/logger';

// Strava rate limits for READ requests: 100 per 15 minutes, 1000 per day
// (Overall limits are 200/2000, but we only use read endpoints)
const SHORT_WINDOW_LIMIT = 100;
const SHORT_WINDOW_SECONDS = 15 * 60; // 15 minutes
const LONG_WINDOW_LIMIT = 1000;
const LONG_WINDOW_SECONDS = 24 * 60 * 60; // 24 hours

export class RateLimiter {
  constructor(private db: DatabaseClient) {}

  // Check if we can make a request without exceeding limits
  async canMakeRequest(): Promise<{ allowed: boolean; reason?: string }> {
    const now = Math.floor(Date.now() / 1000);

    // Check 15-minute window
    const shortWindowStart = now - SHORT_WINDOW_SECONDS;
    const shortUsage = await this.getUsageInWindow(shortWindowStart, '15min');

    if (shortUsage >= SHORT_WINDOW_LIMIT - 10) { // Leave 10 request buffer
      return {
        allowed: false,
        reason: `Approaching 15-minute rate limit (${shortUsage}/${SHORT_WINDOW_LIMIT})`,
      };
    }

    // Check daily window
    const longWindowStart = now - LONG_WINDOW_SECONDS;
    const longUsage = await this.getUsageInWindow(longWindowStart, 'daily');

    if (longUsage >= LONG_WINDOW_LIMIT - 50) { // Leave 50 request buffer
      return {
        allowed: false,
        reason: `Approaching daily rate limit (${longUsage}/${LONG_WINDOW_LIMIT})`,
      };
    }

    return { allowed: true };
  }

  // Record a request
  async recordRequest(): Promise<void> {
    const now = Math.floor(Date.now() / 1000);

    // Record for both windows
    await this.incrementCounter(now, '15min');
    await this.incrementCounter(now, 'daily');

    log('Recorded API request');
  }

  // Get usage count in a time window
  private async getUsageInWindow(windowStart: number, windowType: '15min' | 'daily'): Promise<number> {
    const result = await this.db.first<{ total: number }>(
      `SELECT SUM(requests_count) as total
       FROM rate_limits
       WHERE window_start >= ? AND window_type = ?`,
      [windowStart, windowType]
    );

    return result?.total || 0;
  }

  // Increment counter for a window
  private async incrementCounter(timestamp: number, windowType: '15min' | 'daily'): Promise<void> {
    // Round timestamp to window boundary
    const windowStart = this.roundToWindow(timestamp, windowType);

    await this.db.run(
      `INSERT INTO rate_limits (window_start, window_type, requests_count, created_at)
       VALUES (?, ?, 1, ?)
       ON CONFLICT(window_start, window_type)
       DO UPDATE SET requests_count = requests_count + 1`,
      [windowStart, windowType, timestamp]
    );
  }

  // Round timestamp to window boundary
  private roundToWindow(timestamp: number, windowType: '15min' | 'daily'): number {
    if (windowType === '15min') {
      return Math.floor(timestamp / SHORT_WINDOW_SECONDS) * SHORT_WINDOW_SECONDS;
    } else {
      return Math.floor(timestamp / LONG_WINDOW_SECONDS) * LONG_WINDOW_SECONDS;
    }
  }

  // Clean up old rate limit records (older than 24 hours)
  async cleanup(): Promise<void> {
    const cutoff = Math.floor(Date.now() / 1000) - LONG_WINDOW_SECONDS;
    await this.db.run(
      'DELETE FROM rate_limits WHERE window_start < ?',
      [cutoff]
    );
    log('Cleaned up old rate limit records');
  }
}
