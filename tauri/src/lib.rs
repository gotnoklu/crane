// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri::{
    generate_handler,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager,
};

use crate::commands::fetch_user_settings;

mod commands;
mod db;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn setup() -> tauri::Builder<tauri::Wry> {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let handle = app.handle().clone();

            tauri::async_runtime::block_on(async move {
                let database = db::Database::new(&handle)
                    .await
                    .expect("Failed to initialise database.");

                app.manage(db::DatabaseState {
                    pool: database.pool,
                });

                let settings = fetch_user_settings(app.state())
                    .await
                    .expect("Failed to fetch user settings.");

                if settings.show_app_in_system_tray {
                    let hide_i = MenuItem::with_id(app, "hide", "Hide Windows", true, None::<&str>)
                        .expect("Failed to create menu item.");

                    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)
                        .expect("Failed to create menu item.");

                    let menu = Menu::with_items(app, &[&hide_i, &quit_i])
                        .expect("Failed to construct system tray menu.");

                    // Add app to tray
                    TrayIconBuilder::new()
                        .icon(app.default_window_icon().unwrap().clone())
                        .menu(&menu)
                        .on_menu_event(|app, event| match event.id.as_ref() {
                            "hide" => {
                                // Hide all windows
                                let _ = app.app_handle().webview_windows().iter().map(|win| {
                                    win.1.close().expect("Failed to hide window");
                                });
                            }
                            "quit" => {
                                // Exit the app
                                app.exit(0);
                            }
                            _ => {}
                        })
                        .on_tray_icon_event(|tray, event| match event {
                            TrayIconEvent::Click {
                                button: MouseButton::Left,
                                button_state: MouseButtonState::Up,
                                ..
                            } => {
                                //Focus the main window when the tray is clicked
                                let app = tray.app_handle();
                                if let Some(window) = app.get_webview_window("main") {
                                    let _ = window.show();
                                    let _ = window.set_focus();
                                }
                            }
                            _ => {}
                        })
                        .build(app)
                        .expect("Failed to add app to tray.");
                }
            });

            Ok(())
        })
        .invoke_handler(generate_handler![
            commands::add_chronograph,
            commands::add_workspace,
            commands::fetch_all_chronographs,
            commands::fetch_all_workspaces,
            commands::fetch_current_workspace,
            commands::fetch_user_settings,
            commands::update_chronograph,
            commands::update_workspace,
            commands::update_user_settings,
            commands::delete_workspace,
            commands::delete_chronograph,
        ])
}
