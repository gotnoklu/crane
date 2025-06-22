use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::db::DatabaseState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Workspace {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub is_favourite: bool,
    pub is_selected: bool,
    pub created_at: String,
    pub modified_at: String,
    pub deleted_at: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct WorkspaceInput {
    pub title: String,
    pub description: String,
    pub is_favourite: bool,
    pub is_selected: bool,
}

#[tauri::command(rename_all = "snake_case")]
pub async fn fetch_all_workspaces(
    state: tauri::State<'_, DatabaseState>,
) -> Result<Vec<Workspace>, tauri::Error> {
    let statement = r#"
    SELECT *
    FROM workspaces
    ORDER BY id DESC;
  "#;

    let pool = &state.pool;
    let result = sqlx::query_as::<_, Workspace>(statement)
        .fetch_all(pool)
        .await
        .expect("Fetching all workspaces failed!");

    Ok(result)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn fetch_current_workspace(
    state: tauri::State<'_, DatabaseState>,
) -> Result<Workspace, tauri::Error> {
    let statement = r#"
    SELECT *
    FROM workspaces
    WHERE
      is_selected = 1;
  "#;

    let pool = &state.pool;
    let result = sqlx::query_as::<_, Workspace>(statement)
        .fetch_one(pool)
        .await
        .expect("Fetching all workspaces failed!");

    Ok(result)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn add_workspace(
    state: tauri::State<'_, DatabaseState>,
    workspace: WorkspaceInput,
) -> Result<bool, tauri::Error> {
    let statement = r#"
    INSERT INTO workspaces
    (title, description, is_favourite, is_selected)
    VALUES ($1, $2, $3, $4);
  "#;

    let pool = &state.pool;
    let result = sqlx::query(statement)
        .bind(&workspace.title)
        .bind(&workspace.description)
        .bind(&workspace.is_favourite)
        .bind(&workspace.is_selected)
        .execute(pool)
        .await
        .expect("Adding workspace failed!");

    if result.rows_affected() == 0 {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn update_workspace(
    state: tauri::State<'_, DatabaseState>,
    id: u32,
    workspace: WorkspaceInput,
) -> Result<bool, tauri::Error> {
    let statement = r#"
    UPDATE workspaces
    SET title = $1,
        description = $2,
        is_favourite = $3
        is_selected = $4
    WHERE id = $5;
  "#;

    let pool = &state.pool;
    let result = sqlx::query(statement)
        .bind(&workspace.title)
        .bind(&workspace.description)
        .bind(&workspace.is_favourite)
        .bind(&workspace.is_selected)
        .bind(&id)
        .execute(pool)
        .await
        .expect("Updating chronograph failed!");

    if result.rows_affected() == 0 {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn delete_workspace(
    state: tauri::State<'_, DatabaseState>,
    id: u32,
) -> Result<bool, tauri::Error> {
    let statement = r#"
     DELETE FROM workspaces
     WHERE id = $1;
    "#;

    let pool = &state.pool;
    let result = sqlx::query(statement)
        .bind(&id)
        .execute(pool)
        .await
        .expect("Deleting workspace failed!");

    if result.rows_affected() == 0 {
        return Ok(false);
    }

    Ok(true)
}
