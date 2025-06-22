import type { Chronograph } from '../../../stores/chronographs'
import { IconButton, Stack, SvgIcon, Typography, styled } from '@suid/material'
import { createSignal, createMemo, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { fromMilliseconds } from '../../../utilities'
import TimeGraphCard from './card'
import { IconCheck, IconPlayerPause, IconPlayerPlay, IconRestore } from '@tabler/icons-solidjs'
import { userSettings } from '../../../stores/settings'
import { sendNotification } from '../../../stores/notifications'
import TimeGraphHeader from './header'

export interface TimeGraphProps extends Chronograph {
  enlarged?: boolean
  onClose?(): void
}

const StyledInput = styled('input')(({ theme }) => ({
  border: 'none',
  outline: 'none',
  maxWidth: '132px',
  textAlign: 'center',
  fontFamily: theme.typography.monospace?.fontFamily,
  borderRadius: theme.shape.borderRadius * 3,
  color: theme.palette.text.primary,
  backgroundColor: 'transparent',
  transition: theme.transitions.create(['background-color'], {
    duration: theme.transitions.duration.shortest,
  }),
  '&:hover': {
    backgroundColor: 'rgba(100, 100, 100, 0.2)',
  },
}))

export default function TimeGraph(props: TimeGraphProps) {
  const baseTimeDuration = fromMilliseconds(props.duration)

  const [time, setTime] = createStore({
    hours: Math.min(Math.max(baseTimeDuration.hours, 0), 99),
    minutes: Math.min(Math.max(baseTimeDuration.minutes, 0), 59),
    seconds: Math.min(Math.max(baseTimeDuration.seconds, 0), 59),
  })

  const [isRunning, setIsRunning] = createSignal(false)

  let timer: number | undefined = undefined
  let startTime = 0
  let elapsedTime = props.duration

  const isTimer = createMemo(() => props.kind === 'timer')

  function updateTimer() {
    if (isTimer()) {
      elapsedTime = elapsedTime - 1000

      if (elapsedTime === 0) {
        if (userSettings.notify_on_timer_complete) {
          sendNotification({ title: 'Completed!', body: `"${props.name}" is done.` })
        }
        clearInterval(timer)
        setIsRunning(false)
      }
    } else {
      elapsedTime = Date.now() - startTime
    }

    setTime(fromMilliseconds(elapsedTime))
  }

  function resetTimer() {
    clearInterval(timer)
    startTime = 0
    elapsedTime = 0

    if (isTimer()) {
      setTime({
        hours: Math.min(Math.max(props.duration.hours, 0), 99),
        minutes: Math.min(Math.max(props.duration.minutes, 0), 59),
        seconds: Math.min(Math.max(props.duration.seconds, 0), 59),
      })
    } else {
      setTime({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    }

    setIsRunning(false)
  }

  function triggerTimer() {
    if (isRunning()) {
      clearInterval(timer)
      setIsRunning(false)
    } else {
      if (isTimer()) {
        timer = setInterval(updateTimer, 1000)
      } else {
        startTime = Date.now() - elapsedTime
        timer = setInterval(updateStopwatch, 10)
      }
      setIsRunning(true)
    }
  }

  function calculateTimerValue(
    event: KeyboardEvent & { target: Element; currentTarget: HTMLInputElement },
    max = 59
  ) {
    const { value } = event.currentTarget
    let currentValueAsNumber = Math.min(Math.max(Number.parseInt(value), 0), max)

    if (/[0-9]/.test(event.key)) {
      let currentValue
      if (event.currentTarget.selectionEnd === 0) {
        currentValue = `${event.key}${value[value.length - 1]}`
      } else if (event.currentTarget.selectionEnd === 1) {
        currentValue = `${value[0]}${event.key}`
      } else {
        currentValue = `${value[value.length - 1]}${event.key}`
      }

      currentValueAsNumber = Math.min(Math.max(Number.parseInt(currentValue), 0), max)

      if (Number.isNaN(currentValueAsNumber)) currentValueAsNumber = max

      event.preventDefault()
    }

    return currentValueAsNumber
  }

  function updateHours(
    event: KeyboardEvent & { target: Element; currentTarget: HTMLInputElement }
  ) {
    const isNumberKey = /[0-9]/.test(event.key)
    const isBackspaceKey = event.key === 'Backspace'
    const isEnterKey = event.key === 'Enter'
    const isArrowKey = event.key === 'ArrowLeft' || event.key === 'ArrowRight'

    const isAcceptedKey = isNumberKey || isBackspaceKey || isEnterKey || isArrowKey
    if (!isAcceptedKey) return event.preventDefault()

    if (isNumberKey || isBackspaceKey) setTime('hours', calculateTimerValue(event, 99))
  }

  function updateMinutes(
    event: KeyboardEvent & { target: Element; currentTarget: HTMLInputElement }
  ) {
    const isNumberKey = /[0-9]/.test(event.key)
    const isBackspaceKey = event.key === 'Backspace'
    const isEnterKey = event.key === 'Enter'
    const isArrowKey = event.key === 'ArrowLeft' || event.key === 'ArrowRight'

    const isAcceptedKey = isNumberKey || isBackspaceKey || isEnterKey || isArrowKey
    if (!isAcceptedKey) return event.preventDefault()

    if (isNumberKey || isBackspaceKey) setTime('minutes', calculateTimerValue(event))
  }

  function updateSeconds(
    event: KeyboardEvent & { target: Element; currentTarget: HTMLInputElement }
  ) {
    const isNumberKey = /[0-9]/.test(event.key)
    const isBackspaceKey = event.key === 'Backspace'
    const isEnterKey = event.key === 'Enter'
    const isArrowKey = event.key === 'ArrowLeft' || event.key === 'ArrowRight'

    const isAcceptedKey = isNumberKey || isBackspaceKey || isEnterKey || isArrowKey
    if (!isAcceptedKey) return event.preventDefault()

    if (isNumberKey || isBackspaceKey) setTime('seconds', calculateTimerValue(event))
  }

  return (
    <TimeGraphCard running={isRunning} enlarged={props.enlarged}>
      <TimeGraphHeader name={props.name} enlarged={props.enlarged} onClose={props.onClose} />
      <Stack gap={2} paddingX={6} paddingY={3}>
        <Stack direction="row" alignItems="center">
          <Show
            when={isRunning() || !isTimer()}
            fallback={
              <StyledInput
                minlength="2"
                maxlength="2"
                sx={{
                  fontSize: props.enlarged ? 'h1.fontSize' : 'h4.fontSize',
                }}
                value={time.hours.toString().padStart(2, '0')}
                onKeyDown={updateHours}
              />
            }
          >
            <Typography
              component="span"
              variant="monospace"
              fontSize={props.enlarged ? 'h1.fontSize' : 'h4.fontSize'}
            >
              {time.hours.toString().padStart(2, '0')}
            </Typography>
          </Show>
          <Typography
            component="span"
            variant="monospace"
            fontSize={props.enlarged ? 'h1.fontSize' : 'h4.fontSize'}
          >
            :
          </Typography>
          <Show
            when={isRunning() || !isTimer()}
            fallback={
              <StyledInput
                sx={{
                  fontSize: props.enlarged ? 'h1.fontSize' : 'h4.fontSize',
                }}
                value={time.minutes.toString().padStart(2, '0')}
                onKeyDown={updateMinutes}
              />
            }
          >
            <Typography
              component="span"
              variant="monospace"
              fontSize={props.enlarged ? 'h1.fontSize' : 'h4.fontSize'}
            >
              {time.minutes.toString().padStart(2, '0')}
            </Typography>
          </Show>
          <Typography
            component="span"
            variant="monospace"
            fontSize={props.enlarged ? 'h1.fontSize' : 'h4.fontSize'}
          >
            :
          </Typography>
          <Show
            when={isRunning() || !isTimer()}
            fallback={
              <StyledInput
                min="0"
                max="59"
                sx={{
                  fontSize: props.enlarged ? 'h1.fontSize' : 'h4.fontSize',
                }}
                value={time.seconds.toString().padStart(2, '0')}
                onKeyDown={updateSeconds}
              />
            }
          >
            <Typography
              component="span"
              variant="monospace"
              fontSize={props.enlarged ? 'h1.fontSize' : 'h4.fontSize'}
            >
              {time.seconds.toString().padStart(2, '0')}
            </Typography>
          </Show>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="center" flex={1} gap={1}>
          <IconButton onClick={resetTimer}>
            <SvgIcon>
              <IconRestore />
            </SvgIcon>
          </IconButton>
          <IconButton
            color="primary"
            onClick={triggerTimer}
            disabled={props.duration === 0 && isTimer()}
          >
            <Show
              when={isRunning()}
              fallback={
                <SvgIcon>
                  <IconPlayerPlay />
                </SvgIcon>
              }
            >
              <SvgIcon>
                <IconPlayerPause />
              </SvgIcon>
            </Show>
          </IconButton>
          <Show when={isTimer()}>
            <IconButton color="success">
              <SvgIcon>
                <IconCheck />
              </SvgIcon>
            </IconButton>
          </Show>
        </Stack>
      </Stack>
    </TimeGraphCard>
  )
}
