import { invoke } from '@tauri-apps/api/core'
import { createStore } from 'solid-js/store'

type UserSettings = {
  theme: 'system' | 'light' | 'dark'
  show_app_in_system_tray: boolean
  notify_on_timer_complete: boolean
}

export const [userSettings, setUserSettings] = createStore<UserSettings>({
  theme: 'system',
  show_app_in_system_tray: false,
  notify_on_timer_complete: false,
})

export async function fetchUserSettings() {
  const settings = await invoke<UserSettings>('fetch_user_settings')
  return setUserSettings(settings)
}

export async function updateUserSettings(settings: Partial<UserSettings>) {
  setUserSettings((prev) => ({ ...prev, ...settings }))
  await invoke('update_user_settings', { settings: userSettings })
}
