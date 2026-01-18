-- Fix user_stats table to ensure proper unique constraint with time_period
-- This migration recreates the user_stats table with the correct constraint

-- Create new table with correct schema
CREATE TABLE IF NOT EXISTS user_stats_new (
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

-- Copy data from old table (if it exists and has data)
INSERT OR IGNORE INTO user_stats_new (id, user_id, stat_type, time_period, stat_value, total_xp, level, activities_count, updated_at)
SELECT id, user_id, stat_type,
  COALESCE(time_period, 'all_time') as time_period,
  stat_value, total_xp, level, activities_count, updated_at
FROM user_stats;

-- Drop old table
DROP TABLE user_stats;

-- Rename new table
ALTER TABLE user_stats_new RENAME TO user_stats;

-- Recreate indexes
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_user_stats_stat_type ON user_stats(stat_type);
CREATE INDEX idx_user_stats_time_period ON user_stats(time_period);
CREATE INDEX idx_user_stats_level ON user_stats(level DESC);
CREATE INDEX idx_user_stats_stat_value ON user_stats(stat_value DESC);
CREATE INDEX idx_user_stats_period_level ON user_stats(time_period, level DESC);
