-- Add pre-calculated XP columns to activities table
-- XP is calculated at import time so stats can be aggregated with SQL SUM
-- instead of loading all activities into JS
ALTER TABLE activities ADD COLUMN total_xp REAL DEFAULT 0;
ALTER TABLE activities ADD COLUMN strength_xp REAL DEFAULT 0;
ALTER TABLE activities ADD COLUMN endurance_xp REAL DEFAULT 0;
ALTER TABLE activities ADD COLUMN agility_xp REAL DEFAULT 0;

-- Composite index for efficient weekly stats aggregation
CREATE INDEX IF NOT EXISTS idx_activities_user_start ON activities(user_id, start_date);
