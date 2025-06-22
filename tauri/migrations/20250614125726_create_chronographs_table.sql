-- Add migration script here
CREATE TABLE chronographs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspace_id INTEGER DEFAULT 0 REFERENCES workspaces(id) ON UPDATE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  kind TEXT NOT NULL CHECK(kind IN ('timer', 'stopwatch')),
  state TEXT NOT NULL CHECK(state IN ('paused', 'active')),
  duration INTEGER NOT NULL DEFAULT 0,
  logs JSON NOT NULL DEFAULT 'json([])',
  is_favourite BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  modified_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update `modified_at` automatically
CREATE TRIGGER update_chronographs_modified_at
AFTER
UPDATE
  ON chronographs FOR EACH ROW
  WHEN OLD.modified_at = NEW.modified_at BEGIN
UPDATE
  chronographs
SET
  modified_at = CURRENT_TIMESTAMP
WHERE
  id = NEW.id;

END;

-- Create indexes
CREATE INDEX idx_chronographs_name ON chronographs(name);

CREATE INDEX idx_chronographs_is_favourite ON chronographs(is_favourite);