-- Add migration script here
INSERT INTO
  workspaces (
    id,
    title,
    description,
    is_selected,
    is_favourite
  )
VALUES
  (
    0,
    'Default Workspace',
    'The default workspace',
    1,
    1
  );