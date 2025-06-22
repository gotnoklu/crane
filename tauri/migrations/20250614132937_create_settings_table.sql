-- Add migration script here
CREATE TABLE settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme TEXT CHECK(theme IN ('system', 'light', 'dark')) NOT NULL DEFAULT 'system',
  show_app_in_system_tray BOOLEAN DEFAULT 0,
  notify_on_timer_complete BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  modified_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update `modified_at` automatically
CREATE TRIGGER update_settings_modified_at
AFTER
UPDATE
  ON settings FOR EACH ROW
  WHEN OLD.modified_at = NEW.modified_at BEGIN
UPDATE
  settings
SET
  modified_at = CURRENT_TIMESTAMP
WHERE
  id = NEW.id;

END;