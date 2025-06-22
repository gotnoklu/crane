import type { Chronograph } from '../../../stores/chronographs'
import { IconButton, Stack, SvgIcon, Typography, Box, InputBase, styled } from '@suid/material'
import { createSignal, createMemo, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import { fromMilliseconds } from '../../../utilities'
import TimeGraphCard from './card'
import {
  IconCheck,
  IconPlayerPause,
  IconPlayerPlay,
  IconRestore,
  IconPencilCheck,
  IconPencil,
  IconX,
} from '@tabler/icons-solidjs'
import { userSettings } from '../../../stores/settings'
import { sendNotification } from '../../../stores/notifications'
import { updateChronograph } from '../../../stores/chronographs'
import type { ChangeEvent } from '@suid/types'
import type { DOMElement } from 'solid-js/jsx-runtime'
import { currentWorkspace } from '../../../stores/workspaces'

export interface TimeGraphProps extends Omit<Chronograph, 'created_at' | 'modified_at'> {
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

  const [graph, setGraph] = createStore({
    name: props.name,
    hours: Math.min(Math.max(baseTimeDuration.hours, 0), 99),
    minutes: Math.min(Math.max(baseTimeDuration.minutes, 0), 59),
    seconds: Math.min(Math.max(baseTimeDuration.seconds, 0), 59),
    milliseconds: 0,
  })

  const [isRunning, setIsRunning] = createSignal(false)
  const [isEditingName, setIsEditingName] = createSignal(false)

  let timer: number | undefined = undefined
  let startTime = 0
  let elapsedTime = props.duration

  const isTimer = createMemo(() => props.kind === 'timer')

  function updateTimeGraph() {
    if (isTimer()) {
      elapsedTime = elapsedTime - 1000

      if (elapsedTime === 0) {
        if (userSettings.notify_on_timer_complete) {
          sendNotification({ title: 'Completed!', body: `"${props.name}" is done.` })
        }

        clearInterval(timer)
        setIsRunning(false)

        updateChronograph({
          workspace_id: currentWorkspace()?.id as number,
          id: props.id,
          chronograph: {
            name: graph.name,
            kind: props.kind,
            state: isRunning() ? 'active' : 'paused',
            duration: elapsedTime,
            is_favourite: props.is_favourite,
          },
        })
      }
    } else {
      elapsedTime = Date.now() - startTime
    }

    setGraph(fromMilliseconds(elapsedTime))
  }

  function resetTimeGraph() {
    clearInterval(timer)
    startTime = 0
    elapsedTime = 0

    if (isTimer()) {
      setGraph({
        hours: Math.min(Math.max(baseTimeDuration.hours, 0), 99),
        minutes: Math.min(Math.max(baseTimeDuration.minutes, 0), 59),
        seconds: Math.min(Math.max(baseTimeDuration.seconds, 0), 59),
        milliseconds: 0,
      })
    } else {
      setGraph({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
    }

    setIsRunning(false)
  }

  function triggerTimeGraph() {
    if (isRunning()) {
      clearInterval(timer)
      setIsRunning(false)

      updateChronograph({
        workspace_id: currentWorkspace()?.id as number,
        id: props.id,
        chronograph: {
          name: graph.name,
          kind: props.kind,
          state: 'paused',
          duration: elapsedTime,
          is_favourite: props.is_favourite,
        },
      })
    } else {
      if (isTimer()) {
        timer = setInterval(updateTimeGraph, 1000)
      } else {
        startTime = Date.now() - elapsedTime
        timer = setInterval(updateTimeGraph, 10)
      }

      setIsRunning(true)

      updateChronograph({
        workspace_id: currentWorkspace()?.id as number,
        id: props.id,
        chronograph: {
          name: graph.name,
          kind: props.kind,
          state: 'active',
          duration: elapsedTime,
          is_favourite: props.is_favourite,
        },
      })
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

    if (isNumberKey || isBackspaceKey) setGraph('hours', calculateTimerValue(event, 99))
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

    if (isNumberKey || isBackspaceKey) setGraph('minutes', calculateTimerValue(event))
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

    if (isNumberKey || isBackspaceKey) setGraph('seconds', calculateTimerValue(event))
  }

  const fontSize = props.enlarged ? 'h6.fontSize' : 'body1.fontSize'

  function showEditButton(
    event: MouseEvent & {
      currentTarget: HTMLDivElement
      target: DOMElement
    }
  ) {
    const editButton = event.currentTarget.querySelector<HTMLButtonElement>('button#edit-btn')
    if (editButton) editButton.style.display = 'inline-flex'
  }

  function hideEditButton(
    event: MouseEvent & {
      currentTarget: HTMLDivElement
      target: DOMElement
    }
  ) {
    if (!isEditingName()) {
      const editButton = event.currentTarget.querySelector<HTMLButtonElement>('button#edit-btn')
      if (editButton) editButton.style.display = 'none'
    }
  }

  function toggleLabelInput() {
    if (isEditingName()) {
      setIsEditingName(false)
    } else {
      setIsEditingName(true)
    }
  }

  function updateName(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setGraph((prev) => ({ ...prev, name: event.target.value }))
  }

  async function saveLabelOnEnter(
    event: KeyboardEvent & {
      currentTarget: HTMLInputElement
      target: DOMElement
    }
  ) {
    if (event.key === 'Enter') {
      setIsEditingName(false)
      await updateChronograph({
        workspace_id: currentWorkspace()?.id as number,
        id: props.id,
        chronograph: {
          name: graph.name,
          kind: props.kind,
          state: isRunning() ? 'active' : 'paused',
          duration: elapsedTime,
          is_favourite: props.is_favourite,
        },
      })
    }
  }

  return (
    <TimeGraphCard running={isRunning} enlarged={props.enlarged}>
      <Stack
        component="div"
        direction="row"
        alignItems="center"
        gap={1}
        sx={{
          inlineSize: '100%',
          paddingX: 2,
          ...(props.enlarged
            ? {
                height: 56,
              }
            : {
                height: 48,
              }),
        }}
      >
        <Box flex={1}>
          <Stack
            direction="row"
            alignItems="center"
            gap={1}
            onMouseOver={showEditButton}
            onMouseLeave={hideEditButton}
          >
            <Show
              when={isEditingName()}
              fallback={
                <Typography
                  color="text.secondary"
                  fontSize={fontSize}
                  fontWeight="medium"
                  textAlign={props.enlarged ? 'center' : 'left'}
                  sx={{ flex: 1, maxInlineSize: props.enlarged ? '100%' : '250px' }}
                  onClick={toggleLabelInput}
                  noWrap
                >
                  {graph.name}
                </Typography>
              }
            >
              <InputBase
                id="label-input"
                placeholder="Enter Label"
                sx={{
                  fontSize: fontSize,
                  fontWeight: 'medium',
                  maxInlineSize: props.enlarged ? '100%' : '250px',
                  flex: 1,
                }}
                inputComponent={(props) => <input {...props} />}
                inputProps={{
                  onKeyPress: saveLabelOnEnter,
                }}
                value={graph.name}
                onChange={updateName}
              />
            </Show>
            <IconButton
              id="edit-btn"
              component="button"
              size="small"
              style={{ display: 'none', width: 'max-content', height: 'max-content' }}
              onClick={toggleLabelInput}
            >
              <Show
                when={isEditingName()}
                fallback={
                  <SvgIcon fontSize="small">
                    <IconPencil />
                  </SvgIcon>
                }
              >
                <SvgIcon fontSize="small" color="success">
                  <IconPencilCheck />
                </SvgIcon>
              </Show>
            </IconButton>
          </Stack>
        </Box>
        <Show when={typeof props.onClose === 'function'}>
          <IconButton
            component="button"
            size="small"
            onClick={props.onClose}
            sx={{ justifySelf: 'flex-end' }}
          >
            <SvgIcon fontSize="small">
              <IconX />
            </SvgIcon>
          </IconButton>
        </Show>
      </Stack>
      <Stack gap={2} paddingX={6} paddingY={3}>
        <Stack direction="row" alignItems="baseline">
          <Show
            when={isRunning() || !isTimer()}
            fallback={
              <StyledInput
                minlength="2"
                maxlength="2"
                sx={{
                  fontSize: props.enlarged ? 'h1.fontSize' : 'h4.fontSize',
                  width: props.enlarged ? 'max-content' : 'calc(2.125rem * 1.5)',
                }}
                value={graph.hours.toString().padStart(2, '0')}
                onKeyDown={updateHours}
              />
            }
          >
            <Typography
              component="span"
              variant="monospace"
              fontSize={props.enlarged ? 'h1.fontSize' : 'h4.fontSize'}
            >
              {graph.hours.toString().padStart(2, '0')}
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
                minlength="2"
                maxlength="2"
                sx={{
                  fontSize: props.enlarged ? 'h1.fontSize' : 'h4.fontSize',
                  width: props.enlarged ? 'max-content' : 'calc(2.125rem * 1.5)',
                }}
                value={graph.minutes.toString().padStart(2, '0')}
                onKeyDown={updateMinutes}
              />
            }
          >
            <Typography
              component="span"
              variant="monospace"
              fontSize={props.enlarged ? 'h1.fontSize' : 'h4.fontSize'}
            >
              {graph.minutes.toString().padStart(2, '0')}
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
                minlength="2"
                maxlength="2"
                sx={{
                  fontSize: props.enlarged ? 'h1.fontSize' : 'h4.fontSize',
                  width: props.enlarged ? 'max-content' : 'calc(2.125rem * 1.5)',
                }}
                value={graph.seconds.toString().padStart(2, '0')}
                onKeyDown={updateSeconds}
              />
            }
          >
            <Typography
              component="span"
              variant="monospace"
              fontSize={props.enlarged ? 'h1.fontSize' : 'h4.fontSize'}
            >
              {graph.seconds.toString().padStart(2, '0')}
            </Typography>
          </Show>
          <Show when={!isTimer()}>
            <Typography
              component="span"
              variant="monospace"
              color="text.secondary"
              fontSize={props.enlarged ? 'h4.fontSize' : 'body1.fontSize'}
            >
              .{graph.milliseconds.toString().padStart(2, '0')}
            </Typography>
          </Show>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="center" flex={1} gap={1}>
          <IconButton onClick={resetTimeGraph}>
            <SvgIcon>
              <IconRestore />
            </SvgIcon>
          </IconButton>
          <IconButton
            color="primary"
            onClick={triggerTimeGraph}
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
