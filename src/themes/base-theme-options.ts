import '@fontsource/gabarito/400'
import '@fontsource/gabarito/500'
import '@fontsource/dm-mono/500'
import type { TypographyOptions } from '@suid/material/styles/createTypography'
import type { ThemeOptions } from '@suid/material/styles/createTheme'

// Augment the `typography` configuration to include a `monospace` variant
declare module '@suid/material/styles' {
  interface TypographyVariants {
    monospace: TypographyOptions
  }

  interface TypographyVariantsOptions {
    monospace?: TypographyOptions
  }
}

// Add `monospace` to Typography variants
declare module '@suid/material/Typography' {
  interface TypographyPropsVariantOverrides {
    monospace: true
  }
}

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export const BaseThemeOptions: Partial<DeepPartial<ThemeOptions>> = {
  typography: {
    fontFamily: 'Gabarito, Arial',
    fontWeightRegular: 400,
    fontWeightBold: 500,
    fontWeightMedium: 400,
    h1: {
      fontWeight: 400,
    },
    h2: {
      fontWeight: 400,
    },
    h3: {
      fontWeight: 400,
    },
    h4: {
      fontWeight: 400,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
    },
    monospace: {
      fontFamily: 'DM Mono',
      fontSize: 16,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        color: 'text.primary',
      },
    },
    MuiButton: {
      defaultProps: {
        sx: {
          borderRadius: 2,
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        sx: {
          borderRadius: 2,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        sx: {
          borderRadius: 2,
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        sx: { '& .MuiPaper-root': { borderRadius: 2 } },
      },
    },
  },
}
