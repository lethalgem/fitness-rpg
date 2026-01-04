// D1 Database client helpers

import type { Env } from '../types';
import { error as logError } from '../utils/logger';

export class DatabaseClient {
  constructor(private db: D1Database) {}

  // Execute a query and return first result
  async first<T>(query: string, params?: any[]): Promise<T | null> {
    try {
      const stmt = params ? this.db.prepare(query).bind(...params) : this.db.prepare(query);
      return await stmt.first<T>();
    } catch (err) {
      logError('Database query failed', err);
      throw err;
    }
  }

  // Execute a query and return all results
  async all<T>(query: string, params?: any[]): Promise<T[]> {
    try {
      const stmt = params ? this.db.prepare(query).bind(...params) : this.db.prepare(query);
      const result = await stmt.all<T>();
      return result.results || [];
    } catch (err) {
      logError('Database query failed', err);
      throw err;
    }
  }

  // Execute a query and return affected rows info
  async run(query: string, params?: any[]): Promise<D1Result> {
    try {
      const stmt = params ? this.db.prepare(query).bind(...params) : this.db.prepare(query);
      return await stmt.run();
    } catch (err) {
      logError('Database query failed', err);
      throw err;
    }
  }

  // Batch insert/update operations
  async batch(statements: D1PreparedStatement[]): Promise<D1Result[]> {
    try {
      return await this.db.batch(statements);
    } catch (err) {
      logError('Database batch operation failed', err);
      throw err;
    }
  }

  // Transaction-like behavior using batch
  async transaction(queries: Array<{ query: string; params?: any[] }>): Promise<D1Result[]> {
    const statements = queries.map(({ query, params }) => {
      return params ? this.db.prepare(query).bind(...params) : this.db.prepare(query);
    });
    return this.batch(statements);
  }
}

export function createDbClient(env: Env): DatabaseClient {
  return new DatabaseClient(env.DB);
}
