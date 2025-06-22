import { MenuItem, Select, SvgIcon } from '@suid/material'
import { For } from 'solid-js'
import { useTheme } from '../../themes/provider'
import { userSettings } from '../../stores/settings'
import { IconSelector, IconSun, IconDeviceLaptop, IconMoon } from '@tabler/icons-solidjs'

const ThemeOptions = [
  {
    label: 'System',
    value: 'system',
    icon: (
      <SvgIcon fontSize="small" sx={{ width: 18, height: 18 }}>
        <IconDeviceLaptop />
      </SvgIcon>
    ),
  },
  {
    label: 'Light',
    value: 'light',
    icon: (
      <SvgIcon fontSize="small" sx={{ width: 18, height: 18 }}>
        <IconSun />
      </SvgIcon>
    ),
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: (
      <SvgIcon fontSize="small" sx={{ width: 18, height: 18 }}>
        <IconMoon />
      </SvgIcon>
    ),
  },
]

const ThemeOptionIndexes = ThemeOptions.reduce((result, option, index) => {
  result[option.value] = index
  return result
}, {})

export default function ThemeToggle() {
  const { setScheme } = useTheme()

  return (
    <Select
      size="small"
      value={userSettings.theme}
      IconComponent={(props) => (
        <SvgIcon fontSize="small" {...props} sx={{ width: 18, height: 18 }}>
          <IconSelector />
        </SvgIcon>
      )}
      renderValue={(value) => {
        const option = ThemeOptions[ThemeOptionIndexes[value]]
        return (
          <>
            {option.icon}
            {option.label}
          </>
        )
      }}
      MenuProps={{
        sx: { '& .MuiPaper-root': { borderRadius: 2 } },
      }}
      sx={{
        minWidth: 150,
        borderRadius: 2,
        '& .MuiOutlinedInput-input': { display: 'flex', alignItems: 'center', gap: 2 },
      }}
      onChange={(e) => setScheme(e.target.value)}
    >
      <For each={ThemeOptions}>
        {(option) => {
          return (
            <MenuItem
              value={option.value}
              sx={{ gap: 2, alignItems: 'center', marginX: 1, borderRadius: 2 }}
            >
              {option.icon}
              {option.label}
            </MenuItem>
          )
        }}
      </For>
    </Select>
  )
}
