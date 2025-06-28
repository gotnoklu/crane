import { alpha, Box, Stack, styled } from '@suid/material'
import type { Accessor, JSX } from 'solid-js'
import { useTheme } from '../../../themes/provider'

export interface TimeGraphCardProps {
  enlarged?: boolean
  running: Accessor<boolean>
  children: JSX.Element
}

const StyledTimeGraphCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  borderRadius: `${theme.shape.borderRadius * 4}px`,
  '@keyframes rotate': {
    from: {
      transform: 'rotate(0)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
  '&::before': {
    content: '""',
    display: 'block',
    background: `linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, ${alpha(theme.palette.primary.main, 0.75)} 50%, rgba(255, 255, 255, 0) 100%)`,
    height: '500px',
    width: '50px',
    transform: 'translate(0)',
    position: 'absolute',
    animation: 'rotate 5s linear forwards infinite',
    zIndex: 0,
    top: '50%',
    transformOrigin: 'top center',
  },
}))

const StyledTimeGraphCardContent = styled(Stack)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  width: '100%',
  borderRadius: `${theme.shape.borderRadius * 4 - 1}px`,
}))

export default function TimeGraphCard(props: TimeGraphCardProps) {
  const { theme } = useTheme()

  return (
    <StyledTimeGraphCard
      width="max-content"
      sx={{
        backgroundColor: 'background.default',
        '&::before': {
          animationPlayState: props.running() ? 'running' : 'paused',
        },
      }}
    >
      <StyledTimeGraphCardContent
        alignItems="center"
        justifyContent="center"
        flex={1}
        sx={{
          backgroundColor: props.enlarged
            ? 'background.default'
            : theme().palette.mode === 'dark'
              ? 'rgba(0, 0, 0, 1)'
              : 'rgba(245, 245, 245, 1)',
          paddingBottom: 1,
        }}
        style={{
          margin: props.enlarged ? '0px' : '1px',
        }}
      >
        {props.children}
      </StyledTimeGraphCardContent>
    </StyledTimeGraphCard>
  )
}
