import { Route, Router } from '@solidjs/router'
import { Box } from '@suid/material'
import HomePage from './pages/home'
import { ThemeProvider } from './themes/provider'
import { onMount } from 'solid-js'
import { fetchUserSettings } from './stores/settings'
import { fetchAllWorkspaces } from './stores/workspaces'
import { requestNotificationPermissions } from './stores/notifications'

function App() {
  onMount(() => {
    requestNotificationPermissions()
    fetchUserSettings()
    fetchAllWorkspaces()
  })

  return (
    <ThemeProvider>
      <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: 'background.default' }}>
        <Router>
          <Route path="/" component={HomePage} />
        </Router>
      </Box>
    </ThemeProvider>
  )
}

export default App
