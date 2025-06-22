import { CssBaseline, ThemeProvider as SuidThemeProvider } from '@suid/material'
import {
  type ComponentProps,
  createSignal,
  createEffect,
  createContext,
  createMemo,
  useContext,
} from 'solid-js'
import { LightTheme } from './light'
import { DarkTheme } from './dark'
import { userSettings, updateUserSettings } from '../stores/settings'

const Themes = {
  light: LightTheme,
  dark: DarkTheme,
}

const ThemeContext = createContext({
  theme: Themes.light,
  scheme: 'system',
  setScheme: (_scheme: 'system' | 'light' | 'dark') => 'light',
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider(props: Partial<ComponentProps<typeof SuidThemeProvider>>) {
  const [themeMode, setThemeMode] = createSignal<'light' | 'dark'>('light')

  createEffect(() => {
    if (userSettings.theme === 'system' && window.matchMedia) {
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) setThemeMode('dark')

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        const mode = event.matches ? 'dark' : 'light'
        setThemeMode(mode)
      })
    } else {
      setThemeMode(userSettings.theme)
    }
  })

  const theme = createMemo(() => Themes[themeMode()])

  function setScheme(scheme: 'system' | 'light' | 'dark') {
    let mode: typeof scheme = 'light'
    if (scheme === 'system') {
      if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
        mode = 'dark'
      }
    } else {
      mode = scheme
    }

    updateUserSettings({ theme: scheme })
    return setThemeMode(mode)
  }

  return (
    <ThemeContext.Provider value={{ theme, setScheme }}>
      <CssBaseline />
      <SuidThemeProvider {...props} theme={theme} />
    </ThemeContext.Provider>
  )
}
