// Import job database operations

import type { DatabaseClient } from './client';
import type { ImportJob } from '../types';
import { log } from '../utils/logger';

export class JobRepository {
  constructor(private db: DatabaseClient) {}

  async findById(id: number): Promise<ImportJob | null> {
    return this.db.first<ImportJob>(
      'SELECT * FROM import_jobs WHERE id = ?',
      [id]
    );
  }

  async findActiveByUserId(userId: number): Promise<ImportJob | null> {
    return this.db.first<ImportJob>(
      `SELECT * FROM import_jobs
       WHERE user_id = ?
       AND status IN ('pending', 'in_progress', 'paused', 'completed')
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
  }

  async findPendingJobs(limit = 10): Promise<ImportJob[]> {
    return this.db.all<ImportJob>(
      `SELECT * FROM import_jobs
       WHERE status IN ('pending', 'paused')
       ORDER BY created_at ASC LIMIT ?`,
      [limit]
    );
  }

  async create(userId: number, afterTimestamp?: number): Promise<ImportJob> {
    const now = Math.floor(Date.now() / 1000);

    const result = await this.db.run(
      `INSERT INTO import_jobs (
        user_id, status, total_activities, imported_activities,
        current_page, after_timestamp, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, 'pending', 0, 0, 1, afterTimestamp || null, now, now]
    );

    log('Import job created', { userId, jobId: result.meta.last_row_id, afterTimestamp });

    const job = await this.findById(result.meta.last_row_id!);
    if (!job) throw new Error('Failed to fetch created job');
    return job;
  }

  async updateStatus(
    jobId: number,
    status: ImportJob['status'],
    errorMessage?: string
  ): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    const updates: any[] = [status, now];
    let sql = 'UPDATE import_jobs SET status = ?, updated_at = ?';

    if (status === 'in_progress') {
      sql += ', started_at = ?';
      updates.push(now);
    } else if (status === 'completed' || status === 'failed') {
      sql += ', completed_at = ?';
      updates.push(now);
    }

    if (errorMessage) {
      sql += ', error_message = ?';
      updates.push(errorMessage);
    }

    sql += ' WHERE id = ?';
    updates.push(jobId);

    await this.db.run(sql, updates);
    log('Import job status updated', { jobId, status });
  }

  async updateProgress(
    jobId: number,
    importedActivities: number,
    currentPage: number,
    lastActivityDate?: string
  ): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.run(
      `UPDATE import_jobs
       SET imported_activities = ?, current_page = ?, last_activity_date = ?, updated_at = ?
       WHERE id = ?`,
      [importedActivities, currentPage, lastActivityDate || null, now, jobId]
    );
    log('Import job progress updated', { jobId, importedActivities, currentPage });
  }

  async updateProgressAndStatus(
    jobId: number,
    importedActivities: number,
    currentPage: number,
    lastActivityDate: string | undefined,
    status: string
  ): Promise<void> {
    const now = Math.floor(Date.now() / 1000);
    await this.db.run(
      `UPDATE import_jobs
       SET imported_activities = ?, current_page = ?, last_activity_date = ?, status = ?, updated_at = ?
       WHERE id = ?`,
      [importedActivities, currentPage, lastActivityDate || null, status, now, jobId]
    );
    log('Import job progress and status updated', { jobId, importedActivities, currentPage, status });
  }

  async setTotalActivities(jobId: number, total: number): Promise<void> {
    await this.db.run(
      'UPDATE import_jobs SET total_activities = ? WHERE id = ?',
      [total, jobId]
    );
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.db.run('DELETE FROM import_jobs WHERE user_id = ?', [userId]);
    log('Deleted all import jobs for user', { userId });
  }
}
