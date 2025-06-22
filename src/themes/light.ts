import { BaseThemeOptions } from './base-theme-options'
import { createTheme } from '@suid/material/styles/createTheme'

export const LightTheme = createTheme({
  ...BaseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      light: '#2F97FF',
      main: '#006DDA',
      dark: '#0056AC',
    },
    secondary: {
      light: '#FFCA37',
      main: '#FFBB00',
      dark: '#C89300',
    },
    text: {
      primary: '#333333',
      secondary: 'rgba(50, 50, 50, 0.6)',
    },
  },
})
