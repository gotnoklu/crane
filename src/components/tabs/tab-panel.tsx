import Box from '@suid/material/Box'
import type BoxProps from '@suid/material/Box/BoxProps'
import { Show, splitProps } from 'solid-js'
import { useTabs } from './provider'

export interface TabPanelProps extends BoxProps {
  index: number
}

export default function TabPanel(props: TabPanelProps) {
  const [{ index }, rest] = splitProps(props, ['index'])
  const { index: tabIndex } = useTabs()

  return (
    <Show when={index === tabIndex()}>
      <Box {...rest} />
    </Show>
  )
}
