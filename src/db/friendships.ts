// Friendship repository for managing friend connections

import type { Friendship } from '../types';
import type { DbClient } from './client';

export class FriendshipRepository {
  constructor(private db: DbClient) {}

  // Send a friend request (creates pending friendships for both users)
  async createFriendRequest(userId: number, friendId: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);

    // Create both directions of the friendship with pending status
    // This makes querying easier - each user has a row for each friend
    await this.db.batch([
      this.db.prepare(`
        INSERT INTO friendships (user_id, friend_id, status, requester_id, created_at, updated_at)
        VALUES (?, ?, 'pending', ?, ?, ?)
      `).bind(userId, friendId, userId, now, now),
      this.db.prepare(`
        INSERT INTO friendships (user_id, friend_id, status, requester_id, created_at, updated_at)
        VALUES (?, ?, 'pending', ?, ?, ?)
      `).bind(friendId, userId, userId, now, now),
    ]);
  }

  // Accept a friend request
  async acceptFriendRequest(userId: number, friendId: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);

    // Update both directions to accepted status
    await this.db.batch([
      this.db.prepare(`
        UPDATE friendships
        SET status = 'accepted', updated_at = ?
        WHERE user_id = ? AND friend_id = ?
      `).bind(now, userId, friendId),
      this.db.prepare(`
        UPDATE friendships
        SET status = 'accepted', updated_at = ?
        WHERE user_id = ? AND friend_id = ?
      `).bind(now, friendId, userId),
    ]);
  }

  // Decline a friend request
  async declineFriendRequest(userId: number, friendId: number): Promise<void> {
    // Simply delete both directions when declining
    await this.db.batch([
      this.db.prepare(`DELETE FROM friendships WHERE user_id = ? AND friend_id = ?`).bind(userId, friendId),
      this.db.prepare(`DELETE FROM friendships WHERE user_id = ? AND friend_id = ?`).bind(friendId, userId),
    ]);
  }

  // Remove a friend (delete friendship)
  async removeFriend(userId: number, friendId: number): Promise<void> {
    await this.db.batch([
      this.db.prepare(`DELETE FROM friendships WHERE user_id = ? AND friend_id = ?`).bind(userId, friendId),
      this.db.prepare(`DELETE FROM friendships WHERE user_id = ? AND friend_id = ?`).bind(friendId, userId),
    ]);
  }

  // Get all accepted friends for a user
  async findFriends(userId: number): Promise<Friendship[]> {
    const result = await this.db.prepare(`
      SELECT * FROM friendships
      WHERE user_id = ? AND status = 'accepted'
      ORDER BY created_at DESC
    `).bind(userId).all();

    return result.results as Friendship[];
  }

  // Get pending friend requests (incoming)
  async findPendingRequests(userId: number): Promise<Friendship[]> {
    const result = await this.db.prepare(`
      SELECT * FROM friendships
      WHERE user_id = ? AND status = 'pending' AND requester_id != ?
      ORDER BY created_at DESC
    `).bind(userId, userId).all();

    return result.results as Friendship[];
  }

  // Get sent friend requests (outgoing, still pending)
  async findSentRequests(userId: number): Promise<Friendship[]> {
    const result = await this.db.prepare(`
      SELECT * FROM friendships
      WHERE user_id = ? AND status = 'pending' AND requester_id = ?
      ORDER BY created_at DESC
    `).bind(userId, userId).all();

    return result.results as Friendship[];
  }

  // Check if friendship exists (any status)
  async findFriendship(userId: number, friendId: number): Promise<Friendship | null> {
    const result = await this.db.prepare(`
      SELECT * FROM friendships
      WHERE user_id = ? AND friend_id = ?
    `).bind(userId, friendId).first();

    return result as Friendship | null;
  }

  // Search for users by username/name (for adding friends)
  async searchUsers(query: string, limit: number = 20): Promise<any[]> {
    const searchPattern = `%${query}%`;
    const result = await this.db.prepare(`
      SELECT id, strava_id, username, firstname, lastname, profile_url
      FROM users
      WHERE username LIKE ? OR firstname LIKE ? OR lastname LIKE ?
      LIMIT ?
    `).bind(searchPattern, searchPattern, searchPattern, limit).all();

    return result.results;
  }
}
