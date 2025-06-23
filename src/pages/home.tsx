import { Stack, Toolbar, IconButton } from '@suid/material'
import TimeGraphManager from '../components/chronograph/manager'
import Tabs from '../components/tabs'
import Tab from '../components/tabs/tab'
import { TabProvider } from '../components/tabs/provider'
import Settings from '../components/settings'
import ThemeToggle from '../components/theme-toggle'
import { IconSettings } from '@tabler/icons-solidjs'
import { createSignal } from 'solid-js'

export default function HomePage() {
  const [open, setOpen] = createSignal(false)

  function openSettingsDialog() {
    setOpen(true)
  }

  function closeSettingsDialog() {
    setOpen(false)
  }

  return (
    <Stack height="100%">
      <Settings open={open()} onClose={closeSettingsDialog} />
      <TabProvider>
        <Toolbar sx={{ gap: 2 }}>
          <Tabs sx={{ width: '100%' }}>
            <Tab index={0} size="large">
              Timers
            </Tab>
            <Tab index={1} size="large">
              Stopwatches
            </Tab>
          </Tabs>
          <ThemeToggle />
          <IconButton onClick={openSettingsDialog}>
            <IconSettings />
          </IconButton>
        </Toolbar>
        <TimeGraphManager />
      </TabProvider>
    </Stack>
  )
}
