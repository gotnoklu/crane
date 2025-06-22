use serde::{Deserialize, Serialize};
use sqlx::prelude::FromRow;

use crate::db::DatabaseState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Chronograph {
    pub id: u32,
    pub workspace_id: u32,
    pub name: String,
    pub kind: String,
    pub state: String,
    pub duration: i32,
    pub is_favourite: bool,
    pub created_at: String,
    pub modified_at: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ChronographInput {
    pub workspace_id: u32,
    pub name: String,
    pub kind: String,
    pub state: String,
    pub duration: i32,
    pub is_favourite: bool,
}

#[tauri::command(rename_all = "snake_case")]
pub async fn fetch_all_chronographs(
    state: tauri::State<'_, DatabaseState>,
    workspace_id: u32,
    kind: String,
) -> Result<Vec<Chronograph>, tauri::Error> {
    let statement = r#"
    SELECT *
    FROM chronographs
    WHERE
        workspace_id = $1
    AND
        kind = $2
    ORDER BY id DESC;
  "#;

    let pool = &state.pool;
    let result = sqlx::query_as::<_, Chronograph>(statement)
        .bind(&workspace_id)
        .bind(&kind)
        .fetch_all(pool)
        .await
        .expect("Fetching all chronographs failed!");

    Ok(result)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn add_chronograph(
    state: tauri::State<'_, DatabaseState>,
    chronograph: ChronographInput,
) -> Result<bool, tauri::Error> {
    let statement = r#"
    INSERT INTO chronographs
    (workspace_id, name, kind, state, duration)
    VALUES ($1, $2, $3, $4, $5);
  "#;

    let pool = &state.pool;
    let result = sqlx::query(statement)
        .bind(&chronograph.workspace_id)
        .bind(&chronograph.name)
        .bind(&chronograph.kind)
        .bind(&chronograph.state)
        .bind(&chronograph.duration)
        .execute(pool)
        .await
        .expect("Adding chronograph failed!");

    if result.rows_affected() == 0 {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn update_chronograph(
    state: tauri::State<'_, DatabaseState>,
    chronograph: ChronographInput,
) -> Result<bool, tauri::Error> {
    let statement = r#"
    UPDATE chronographs
    SET workspace_id = $1,
        name = $2,
        kind = $3
        state = $4
        duration = $5
    WHERE id = 0;
  "#;

    let pool = &state.pool;
    let result = sqlx::query(statement)
        .bind(&chronograph.workspace_id)
        .bind(&chronograph.name)
        .bind(&chronograph.kind)
        .bind(&chronograph.state)
        .bind(&chronograph.duration)
        .execute(pool)
        .await
        .expect("Updating chronograph failed!");

    if result.rows_affected() == 0 {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn delete_chronograph(
    state: tauri::State<'_, DatabaseState>,
    workspace_id: u32,
    id: u32,
) -> Result<bool, tauri::Error> {
    let statement = r#"
     DELETE FROM chronographs
     WHERE
        workspace_id = $1
     AND
        id = $2;
    "#;

    let pool = &state.pool;
    let result = sqlx::query(statement)
        .bind(&id)
        .bind(&workspace_id)
        .execute(pool)
        .await
        .expect("Deleting chronograph failed!");

    if result.rows_affected() == 0 {
        return Ok(false);
    }

    Ok(true)
}
