use serde::{Deserialize, Deserializer, Serialize};
use sqlx::prelude::FromRow;

use crate::db::DatabaseState;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserSettings {
    pub id: u8,
    pub theme: String,
    pub show_app_in_system_tray: bool,
    pub notify_on_timer_complete: bool,
    pub created_at: String,
    pub modified_at: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct UserSettingsInput {
    #[serde(default, deserialize_with = "deserialize_optional_field")]
    pub theme: String,
    #[serde(default, deserialize_with = "deserialize_optional_field")]
    pub show_app_in_system_tray: bool,
    #[serde(default, deserialize_with = "deserialize_optional_field")]
    pub notify_on_timer_complete: bool,
}

fn deserialize_optional_field<'de, T, D>(deserializer: D) -> Result<T, D::Error>
where
    D: Deserializer<'de>,
    T: Default + Deserialize<'de>,
{
    let option_result = Option::deserialize(deserializer)?;
    Ok(option_result.unwrap_or_default())
}

#[tauri::command(rename_all = "snake_case")]
pub async fn fetch_user_settings(
    state: tauri::State<'_, DatabaseState>,
) -> Result<UserSettings, tauri::Error> {
    let statement = r#"
    SELECT *
    FROM settings
    WHERE id = 0
    ORDER BY created_at DESC;
  "#;

    let query = sqlx::query_as::<_, UserSettings>(statement);
    let pool = &state.pool;
    let result = query
        .fetch_one(pool)
        .await
        .expect("Fetching user settings failed!");

    Ok(result)
}

#[tauri::command(rename_all = "snake_case")]
pub async fn update_user_settings(
    state: tauri::State<'_, DatabaseState>,
    settings: UserSettingsInput,
) -> Result<bool, tauri::Error> {
    let statement = r#"
    UPDATE settings
    SET theme = $1,
        show_app_in_system_tray = $2,
        notify_on_timer_complete = $3
    WHERE id = 0;
  "#;

    let pool = &state.pool;
    let result = sqlx::query(statement)
        .bind(&settings.theme)
        .bind(&settings.show_app_in_system_tray)
        .bind(&settings.notify_on_timer_complete)
        .execute(pool)
        .await
        .expect("Updating user settings failed!");

    if result.rows_affected() == 0 {
        return Ok(false);
    }

    Ok(true)
}
