import {
  isPermissionGranted,
  requestPermission,
  sendNotification as sendTauriNotification,
  type Options,
} from '@tauri-apps/plugin-notification'
import { createSignal } from 'solid-js'

const [hasNotificationPermission, setHasNotificationPermission] = createSignal(false)

async function requestNotificationPermissions() {
  // Do you have permission to send a notification?
  let permissionGranted = await isPermissionGranted()

  // If not we need to request it
  if (!permissionGranted) {
    const permission = await requestPermission()
    permissionGranted = permission === 'granted'
    return setHasNotificationPermission(permissionGranted)
  }

  return setHasNotificationPermission(true)
}

async function sendNotification(notification: Options | string) {
  if (hasNotificationPermission()) {
    return sendTauriNotification(notification)
  }

  await requestNotificationPermissions()
  await sendTauriNotification(notification)
}

export { hasNotificationPermission, sendNotification, requestNotificationPermissions }
