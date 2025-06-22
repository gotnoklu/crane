import {
  List,
  ListItem,
  ListItemText,
  Dialog,
  Typography,
  DialogContent,
  Checkbox,
  IconButton,
  Toolbar,
  DialogActions,
  Button,
} from '@suid/material'
import type DialogProps from '@suid/material/Dialog/DialogProps'
import { userSettings, updateUserSettings } from '../../stores/settings'
import ThemeToggle from '../theme-toggle'
import { IconSettings, IconX } from '@tabler/icons-solidjs'
import { createSignal, Show } from 'solid-js'
import { relaunch } from '@tauri-apps/plugin-process'

export interface SettingsProps extends DialogProps {}

export function Settings(props: SettingsProps) {
  const [showRestart, setShowRestart] = createSignal(false)

  async function toggleShowInSystemTray() {
    await updateUserSettings({ show_app_in_system_tray: !userSettings.show_app_in_system_tray })
    setShowRestart(true)
  }

  async function toggleNotifyOnTimerComplete() {
    await updateUserSettings({ notify_on_timer_complete: !userSettings.notify_on_timer_complete })
  }

  async function restartApp() {
    await relaunch()
  }

  return (
    <Dialog maxWidth="sm" fullWidth {...props}>
      <Toolbar>
        <IconSettings />
        <Typography sx={{ flex: 1, ml: 2 }}>Settings</Typography>
        <IconButton size="small" onClick={props.onClose}>
          <IconX />
        </IconButton>
      </Toolbar>
      <DialogContent sx={{ paddingTop: 0 }}>
        <List disablePadding>
          <ListItem>
            <ListItemText primary="Theme" secondary="Update colour scheme for the app" />
            <ThemeToggle />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Show in system tray"
              secondary="Show the app in the system tray. Requires a restart to take effect."
            />
            <Checkbox
              checked={userSettings.show_app_in_system_tray}
              onChange={toggleShowInSystemTray}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Notify When Timer Completes"
              secondary="Send a notification when timers are complete"
            />
            <Checkbox
              checked={userSettings.notify_on_timer_complete}
              onChange={toggleNotifyOnTimerComplete}
            />
          </ListItem>
        </List>
      </DialogContent>
      <Show when={showRestart()}>
        <DialogActions>
          <Toolbar>
            <Button variant="contained" size="large" onClick={restartApp}>
              Restart Glide
            </Button>
          </Toolbar>
        </DialogActions>
      </Show>
    </Dialog>
  )
}

export default Settings
