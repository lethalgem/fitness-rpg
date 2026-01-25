-- Fitness RPG Database Schema for Cloudflare D1

-- Users table: stores Strava athlete info and OAuth tokens
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  strava_id TEXT NOT NULL UNIQUE,
  username TEXT,
  firstname TEXT,
  lastname TEXT,
  profile_url TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX idx_users_strava_id ON users(strava_id);

-- Activities table: stores raw activity data from Strava
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL,
  strava_activity_id TEXT NOT NULL UNIQUE,
  name TEXT,
  sport_type TEXT NOT NULL,
  start_date TEXT,
  start_date_local TEXT,
  distance REAL,
  moving_time INTEGER,
  elapsed_time INTEGER,
  total_elevation_gain REAL,
  average_speed REAL,
  max_speed REAL,
  average_heartrate REAL,
  max_heartrate REAL,
  average_watts REAL,
  max_watts INTEGER,
  kilojoules REAL,
  suffer_score INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_strava_id ON activities(strava_activity_id);
CREATE INDEX idx_activities_sport_type ON activities(sport_type);
CREATE INDEX idx_activities_start_date ON activities(start_date);

-- Import jobs table: tracks background imports of historical Strava data
CREATE TABLE IF NOT EXISTS import_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'completed', 'failed', 'paused')),
  total_activities INTEGER DEFAULT 0,
  imported_activities INTEGER DEFAULT 0,
  current_page INTEGER DEFAULT 1,
  last_activity_date TEXT,
  error_message TEXT,
  started_at INTEGER,
  completed_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_import_jobs_user_id ON import_jobs(user_id);
CREATE INDEX idx_import_jobs_status ON import_jobs(status);

-- User stats table: cached aggregated stats for performance
CREATE TABLE IF NOT EXISTS user_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  stat_type TEXT NOT NULL,
  time_period TEXT NOT NULL DEFAULT 'all_time',
  stat_value REAL NOT NULL DEFAULT 0,
  total_xp REAL NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  activities_count INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, stat_type, time_period)
);

CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_stat_type ON user_stats(stat_type);
CREATE INDEX idx_user_stats_time_period ON user_stats(time_period);
CREATE INDEX idx_user_stats_level ON user_stats(level DESC);
CREATE INDEX idx_user_stats_stat_value ON user_stats(stat_value DESC);
CREATE INDEX idx_user_stats_period_level ON user_stats(time_period, level DESC);

-- Rate limit tracking table: tracks Strava API usage
CREATE TABLE IF NOT EXISTS rate_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  window_start INTEGER NOT NULL,
  window_type TEXT NOT NULL CHECK(window_type IN ('15min', 'daily')),
  requests_count INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(window_start, window_type)
);

CREATE INDEX idx_rate_limits_window ON rate_limits(window_start, window_type);

-- Friendships table: stores friend connections between users
-- Bidirectional - both users get a row for easier querying
CREATE TABLE IF NOT EXISTS friendships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'declined', 'blocked')),
  requester_id INTEGER NOT NULL,  -- Who sent the friend request
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
