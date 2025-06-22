-- Add migration script here
INSERT INTO
  settings (
    id,
    theme,
    show_app_in_system_tray,
    notify_on_timer_complete
  )
VALUES
  (0, 'system', 0, 0);