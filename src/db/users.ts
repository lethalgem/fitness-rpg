// User database operations

import type { DatabaseClient } from './client';
import type { User, StravaTokenResponse } from '../types';
import { log } from '../utils/logger';

export class UserRepository {
  constructor(private db: DatabaseClient) {}

  async findByStravaId(stravaId: string): Promise<User | null> {
    return this.db.first<User>(
      'SELECT * FROM users WHERE strava_id = ?',
      [stravaId]
    );
  }

  async findById(id: number): Promise<User | null> {
    return this.db.first<User>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
  }

  async create(tokenResponse: StravaTokenResponse): Promise<User> {
    const now = Math.floor(Date.now() / 1000);
    const athlete = tokenResponse.athlete;

    const result = await this.db.run(
      `INSERT INTO users (
        strava_id, username, firstname, lastname, profile_url,
        access_token, refresh_token, expires_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        athlete.id.toString(),
        athlete.username || null,
        athlete.firstname || null,
        athlete.lastname || null,
        athlete.profile || null,
        tokenResponse.access_token,
        tokenResponse.refresh_token,
        tokenResponse.expires_at,
        now,
        now,
      ]
    );

    log('User created', { stravaId: athlete.id, userId: result.meta.last_row_id });

    // Fetch and return the created user
    const user = await this.findById(result.meta.last_row_id!);
    if (!user) throw new Error('Failed to fetch created user');
    return user;
  }

  async updateTokens(userId: number, accessToken: string, refreshToken: string, expiresAt: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.run(
      `UPDATE users
       SET access_token = ?, refresh_token = ?, expires_at = ?, updated_at = ?
       WHERE id = ?`,
      [accessToken, refreshToken, expiresAt, now, userId]
    );
    log('User tokens updated', { userId });
  }

  async upsert(tokenResponse: StravaTokenResponse): Promise<User> {
    const existing = await this.findByStravaId(tokenResponse.athlete.id.toString());

    if (existing) {
      await this.updateTokens(
        existing.id,
        tokenResponse.access_token,
        tokenResponse.refresh_token,
        tokenResponse.expires_at
      );
      return (await this.findById(existing.id))!;
    } else {
      return this.create(tokenResponse);
    }
  }

  async needsTokenRefresh(user: User): Promise<boolean> {
    const now = Math.floor(Date.now() / 1000);
    const bufferSeconds = 600; // 10 minutes
    return now >= (user.expires_at - bufferSeconds);
  }

  async updateLastDismissedJobId(userId: number, jobId: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.run(
      'UPDATE users SET last_dismissed_job_id = ?, updated_at = ? WHERE id = ?',
      [jobId, now, userId]
    );
    log('User last dismissed job updated', { userId, jobId });
  }
}
