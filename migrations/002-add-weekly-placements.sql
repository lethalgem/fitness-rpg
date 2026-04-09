-- Weekly leaderboard placement tracking
-- Tracks top-3 finishers each week per category for historical medals

-- Raw snapshot of top-3 finishers each week per category
CREATE TABLE IF NOT EXISTS weekly_placements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  week_ending TEXT NOT NULL,
  category TEXT NOT NULL,
  placement INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  stat_value REAL NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(week_ending, category, placement)
);

CREATE INDEX IF NOT EXISTS idx_weekly_placements_user ON weekly_placements(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_placements_week ON weekly_placements(week_ending);

-- Pre-aggregated medal counts per user per category
CREATE TABLE IF NOT EXISTS medal_counts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  category TEXT NOT NULL,
  gold INTEGER NOT NULL DEFAULT 0,
  silver INTEGER NOT NULL DEFAULT 0,
  bronze INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, category)
);

CREATE INDEX IF NOT EXISTS idx_medal_counts_user ON medal_counts(user_id);
