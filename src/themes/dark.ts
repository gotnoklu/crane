import { BaseThemeOptions } from './base-theme-options'
import { createTheme } from '@suid/material/styles/createTheme'

export const DarkTheme = createTheme({
  ...BaseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      light: '#37B6FF',
      main: '#00A2FF',
      dark: '#007FC8',
    },
    secondary: {
      light: '#FFCA37',
      main: '#FFBB00',
      dark: '#C89300',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(150, 150, 150, 0.8)',
    },
    background: {
      default: '#1A1A1A',
      paper: '#0F0F0F',
    },
  },
})
