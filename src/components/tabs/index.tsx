import { alpha, Box, styled } from '@suid/material'
import type BoxProps from '@suid/material/Box/BoxProps'

export interface TabsProps extends BoxProps {}

const StyledTabs = styled(Box)<TabsProps>(({ theme }) => ({
  '--tab-indicator-offset': '0px',
  '--tab-indicator-width': '8px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  // justifyContent: 'space-between',
  width: 'max-content',
  gap: theme.spacing(1),
  '&::after': {
    position: 'absolute',
    left: 'var(--tab-indicator-offset)',
    bottom: '0px',
    content: '""',
    width: 'var(--tab-indicator-width)',
    height: '100%',
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: alpha(theme.palette.primary.light, 0.2),
    transition: `left ${theme.transitions.duration.short}ms, color ${theme.transitions.duration.short}ms`,
  },
  zIndex: 1,
}))

export default function Tabs(props: TabsProps) {
  return <StyledTabs {...props} />
}
