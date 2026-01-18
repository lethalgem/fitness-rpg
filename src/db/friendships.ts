// Friendship repository for managing friend connections

import type { Friendship } from '../types';
import type { DatabaseClient } from './client';

export class FriendshipRepository {
  constructor(private db: DatabaseClient) {}

  // Send a friend request (creates pending friendships for both users)
  async createFriendRequest(userId: number, friendId: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);

    // Create both directions of the friendship with pending status
    // This makes querying easier - each user has a row for each friend
    await this.db.transaction([
      {
        query: `INSERT INTO friendships (user_id, friend_id, status, requester_id, created_at, updated_at)
                VALUES (?, ?, 'pending', ?, ?, ?)`,
        params: [userId, friendId, userId, now, now]
      },
      {
        query: `INSERT INTO friendships (user_id, friend_id, status, requester_id, created_at, updated_at)
                VALUES (?, ?, 'pending', ?, ?, ?)`,
        params: [friendId, userId, userId, now, now]
      }
    ]);
  }

  // Accept a friend request
  async acceptFriendRequest(userId: number, friendId: number): Promise<void> {
    const now = Math.floor(Date.now() / 1000);

    // Update both directions to accepted status
    await this.db.transaction([
      {
        query: `UPDATE friendships SET status = 'accepted', updated_at = ?
                WHERE user_id = ? AND friend_id = ?`,
        params: [now, userId, friendId]
      },
      {
        query: `UPDATE friendships SET status = 'accepted', updated_at = ?
                WHERE user_id = ? AND friend_id = ?`,
        params: [now, friendId, userId]
      }
    ]);
  }

  // Decline a friend request
  async declineFriendRequest(userId: number, friendId: number): Promise<void> {
    // Simply delete both directions when declining
    await this.db.transaction([
      {
        query: `DELETE FROM friendships WHERE user_id = ? AND friend_id = ?`,
        params: [userId, friendId]
      },
      {
        query: `DELETE FROM friendships WHERE user_id = ? AND friend_id = ?`,
        params: [friendId, userId]
      }
    ]);
  }

  // Remove a friend (delete friendship)
  async removeFriend(userId: number, friendId: number): Promise<void> {
    await this.db.transaction([
      {
        query: `DELETE FROM friendships WHERE user_id = ? AND friend_id = ?`,
        params: [userId, friendId]
      },
      {
        query: `DELETE FROM friendships WHERE user_id = ? AND friend_id = ?`,
        params: [friendId, userId]
      }
    ]);
  }

  // Get all accepted friends for a user
  async findFriends(userId: number): Promise<Friendship[]> {
    return this.db.all<Friendship>(
      `SELECT * FROM friendships
       WHERE user_id = ? AND status = 'accepted'
       ORDER BY created_at DESC`,
      [userId]
    );
  }

  // Get pending friend requests (incoming)
  async findPendingRequests(userId: number): Promise<Friendship[]> {
    return this.db.all<Friendship>(
      `SELECT * FROM friendships
       WHERE user_id = ? AND status = 'pending' AND requester_id != ?
       ORDER BY created_at DESC`,
      [userId, userId]
    );
  }

  // Get sent friend requests (outgoing, still pending)
  async findSentRequests(userId: number): Promise<Friendship[]> {
    return this.db.all<Friendship>(
      `SELECT * FROM friendships
       WHERE user_id = ? AND status = 'pending' AND requester_id = ?
       ORDER BY created_at DESC`,
      [userId, userId]
    );
  }

  // Check if friendship exists (any status)
  async findFriendship(userId: number, friendId: number): Promise<Friendship | null> {
    return this.db.first<Friendship>(
      `SELECT * FROM friendships
       WHERE user_id = ? AND friend_id = ?`,
      [userId, friendId]
    );
  }

  // Search for users by username/name (for adding friends)
  async searchUsers(query: string, limit: number = 20): Promise<any[]> {
    const searchPattern = `%${query}%`;
    return this.db.all<any>(
      `SELECT id, strava_id, username, firstname, lastname, profile_url
       FROM users
       WHERE username LIKE ? OR firstname LIKE ? OR lastname LIKE ?
       LIMIT ?`,
      [searchPattern, searchPattern, searchPattern, limit]
    );
  }
}
