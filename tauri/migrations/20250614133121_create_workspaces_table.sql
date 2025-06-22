-- Add migration script here
CREATE TABLE workspaces (
  id INTEGER PRIMARY KEY AUTOINCREMENT DEFAULT 0,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  is_favourite BOOLEAN DEFAULT 0,
  is_selected BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  modified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME DEFAULT NULL
);

-- Create trigger to update `modified_at` automatically
CREATE TRIGGER update_workspaces_modified_at
AFTER
UPDATE
  ON workspaces FOR EACH ROW
  WHEN OLD.modified_at = NEW.modified_at BEGIN
UPDATE
  workspaces
SET
  modified_at = CURRENT_TIMESTAMP
WHERE
  id = NEW.id;

END;

-- Create indexes
CREATE INDEX idx_workspace_title ON workspaces(title);

CREATE INDEX idx_workspace_is_favourite ON workspaces(is_favourite);