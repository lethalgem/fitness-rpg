// Friends API routes

import { Hono } from 'hono';
import type { Env } from '../types';
import { createDbClient } from '../db/client';
import { UserRepository } from '../db/users';
import { FriendshipRepository } from '../db/friendships';
import { ActivityRepository } from '../db/activities';
import { calculateUserStats } from '../stats/calculator';
import { success, error, notFound } from '../utils/response';
import { log } from '../utils/logger';

const friends = new Hono<{ Bindings: Env }>();

// GET /friends/search - Search for users to add as friends
// IMPORTANT: This route must come BEFORE /:userId to avoid matching "search" as a userId
friends.get('/search', async (c) => {
  try {
    const query = c.req.query('q') || '';

    if (query.length < 2) {
      return error('Search query must be at least 2 characters');
    }

    const dbClient = createDbClient(c.env);
    const friendshipRepo = new FriendshipRepository(dbClient);

    const users = await friendshipRepo.searchUsers(query, 20);

    return success({ users });
  } catch (err) {
    console.error('Failed to search users', err);
    return error('Failed to search users');
  }
});

// GET /friends/:userId - Get user's friends list with their stats
friends.get('/:userId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));

    if (isNaN(userId)) {
      return error('Invalid user ID');
    }

    const dbClient = createDbClient(c.env);
    const friendshipRepo = new FriendshipRepository(dbClient);
    const userRepo = new UserRepository(dbClient);
    const activityRepo = new ActivityRepository(dbClient);

    // Get accepted friends
    const friendships = await friendshipRepo.findFriends(userId);

    // Get full user info and stats for each friend
    const friendsWithStats = await Promise.all(
      friendships.map(async (friendship) => {
        const friend = await userRepo.findById(friendship.friend_id);
        if (!friend) return null;

        // Get friend's activities and calculate stats
        const activities = await activityRepo.findByUserId(friend.id, 10000);
        const stats = calculateUserStats(activities);

        return {
          id: friend.id,
          strava_id: friend.strava_id,
          username: friend.username,
          firstname: friend.firstname,
          lastname: friend.lastname,
          profile_url: friend.profile_url,
          stats,
          friendship_since: friendship.created_at,
        };
      })
    );

    // Filter out nulls
    const validFriends = friendsWithStats.filter((f) => f !== null);

    log('Fetched friends list', { userId, count: validFriends.length });

    return success({ friends: validFriends });
  } catch (err) {
    console.error('Failed to fetch friends', err);
    return error('Failed to fetch friends');
  }
});

// GET /friends/:userId/requests - Get pending friend requests
friends.get('/:userId/requests', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));

    if (isNaN(userId)) {
      return error('Invalid user ID');
    }

    const dbClient = createDbClient(c.env);
    const friendshipRepo = new FriendshipRepository(dbClient);
    const userRepo = new UserRepository(dbClient);

    // Get incoming pending requests
    const requests = await friendshipRepo.findPendingRequests(userId);

    // Get full user info for each requester
    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const requester = await userRepo.findById(request.requester_id);
        if (!requester) return null;

        return {
          id: request.id,
          requester: {
            id: requester.id,
            strava_id: requester.strava_id,
            username: requester.username,
            firstname: requester.firstname,
            lastname: requester.lastname,
            profile_url: requester.profile_url,
          },
          created_at: request.created_at,
        };
      })
    );

    const validRequests = requestsWithUsers.filter((r) => r !== null);

    return success({ requests: validRequests });
  } catch (err) {
    console.error('Failed to fetch friend requests', err);
    return error('Failed to fetch friend requests');
  }
});

// POST /friends/:userId/request - Send a friend request
friends.post('/:userId/request', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const body = await c.req.json();
    const friendId = parseInt(body.friendId);

    if (isNaN(userId) || isNaN(friendId)) {
      return error('Invalid user ID');
    }

    if (userId === friendId) {
      return error('Cannot send friend request to yourself');
    }

    const dbClient = createDbClient(c.env);
    const friendshipRepo = new FriendshipRepository(dbClient);
    const userRepo = new UserRepository(dbClient);

    // Check if friend exists
    const friend = await userRepo.findById(friendId);
    if (!friend) {
      return notFound('User not found');
    }

    // Check if friendship already exists
    const existing = await friendshipRepo.findFriendship(userId, friendId);
    if (existing) {
      return error('Friend request already exists');
    }

    await friendshipRepo.createFriendRequest(userId, friendId);

    log('Friend request sent', { userId, friendId });

    return success({ message: 'Friend request sent' });
  } catch (err) {
    console.error('Failed to send friend request', err);
    return error('Failed to send friend request');
  }
});

// POST /friends/:userId/accept - Accept a friend request
friends.post('/:userId/accept', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const body = await c.req.json();
    const friendId = parseInt(body.friendId);

    if (isNaN(userId) || isNaN(friendId)) {
      return error('Invalid user ID');
    }

    const dbClient = createDbClient(c.env);
    const friendshipRepo = new FriendshipRepository(dbClient);

    // Check if friendship exists and is pending
    const friendship = await friendshipRepo.findFriendship(userId, friendId);
    if (!friendship) {
      return notFound('Friend request not found');
    }

    if (friendship.status !== 'pending') {
      return error('Friend request is not pending');
    }

    if (friendship.requester_id === userId) {
      return error('Cannot accept your own friend request');
    }

    await friendshipRepo.acceptFriendRequest(userId, friendId);

    log('Friend request accepted', { userId, friendId });

    return success({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Failed to accept friend request', err);
    return error('Failed to accept friend request');
  }
});

// POST /friends/:userId/decline - Decline a friend request
friends.post('/:userId/decline', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const body = await c.req.json();
    const friendId = parseInt(body.friendId);

    if (isNaN(userId) || isNaN(friendId)) {
      return error('Invalid user ID');
    }

    const dbClient = createDbClient(c.env);
    const friendshipRepo = new FriendshipRepository(dbClient);

    await friendshipRepo.declineFriendRequest(userId, friendId);

    log('Friend request declined', { userId, friendId });

    return success({ message: 'Friend request declined' });
  } catch (err) {
    console.error('Failed to decline friend request', err);
    return error('Failed to decline friend request');
  }
});

// DELETE /friends/:userId/:friendId - Remove a friend
friends.delete('/:userId/:friendId', async (c) => {
  try {
    const userId = parseInt(c.req.param('userId'));
    const friendId = parseInt(c.req.param('friendId'));

    if (isNaN(userId) || isNaN(friendId)) {
      return error('Invalid user ID');
    }

    const dbClient = createDbClient(c.env);
    const friendshipRepo = new FriendshipRepository(dbClient);

    await friendshipRepo.removeFriend(userId, friendId);

    log('Friend removed', { userId, friendId });

    return success({ message: 'Friend removed' });
  } catch (err) {
    console.error('Failed to remove friend', err);
    return error('Failed to remove friend');
  }
});

export default friends;
