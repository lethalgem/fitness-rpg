-- Friends/Friendships table: stores friend connections between users
-- Using a symmetric approach where both directions are stored for easy querying
CREATE TABLE IF NOT EXISTS friendships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'declined', 'blocked')),
  requester_id INTEGER NOT NULL, -- Who sent the friend request
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
CREATE INDEX IF NOT EXISTS idx_friendships_user_status ON friendships(user_id, status);
