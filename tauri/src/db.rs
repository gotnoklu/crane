use std::{env, fs};

use anyhow::Result;
use sqlx::{migrate, sqlite, Executor, Pool, Sqlite, SqlitePool};
use tauri::{AppHandle, Manager};

pub struct Database {
    pub pool: Pool<Sqlite>,
}

impl Database {
    pub async fn new(app_handle: &AppHandle) -> Result<Self> {
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .expect("Failed to get app data directory.");

        if !fs::exists(&app_dir).expect("Path does not exist!") {
            fs::create_dir(&app_dir)?;
        }

        let db_path = app_dir.join("crane_app.db");

        env::set_var("DATABASE_URI", format!("sqlite://{}", db_path.display()));

        println!("Initialising database...");

        let connection_options = sqlite::SqliteConnectOptions::new()
            .filename(&db_path)
            .create_if_missing(true)
            .journal_mode(sqlite::SqliteJournalMode::Wal);

        let pool = SqlitePool::connect_with(connection_options).await?;

        pool.execute("PRAGMA foreign_keys = 1;").await?;

        migrate!("./migrations").run(&pool).await?;

        println!("Database initialised!");

        Ok(Self { pool })
    }
}

#[allow(dead_code)]
pub struct DatabaseState {
    pub pool: Pool<Sqlite>,
}
