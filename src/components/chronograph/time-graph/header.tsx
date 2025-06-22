import { Box, InputBase, IconButton, Stack, SvgIcon, Typography } from '@suid/material'
import { createSignal, Show } from 'solid-js'
import type { ChangeEvent } from '@suid/types'
import type { DOMElement } from 'solid-js/jsx-runtime'
import { IconPencilCheck, IconPencil, IconX } from '@tabler/icons-solidjs'

export interface TimeGraphHeaderProps {
  name: string
  enlarged?: boolean
  onClose?(): void
}

export default function TimeGraphHeader(props: TimeGraphHeaderProps) {
  const [name, setName] = createSignal(props.name)
  const [isEditing, setIsEditing] = createSignal(false)

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
    if (!isEditing()) {
      const editButton = event.currentTarget.querySelector<HTMLButtonElement>('button#edit-btn')
      if (editButton) editButton.style.display = 'none'
    }
  }

  function toggleLabelInput() {
    if (isEditing()) {
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  function updateLabel(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setName(event.target.value)
  }

  function saveLabelOnEnter(
    event: KeyboardEvent & {
      currentTarget: HTMLInputElement
      target: DOMElement
    }
  ) {
    if (event.key === 'Enter') {
      setIsEditing(false)
    }
  }

  return (
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
            when={isEditing()}
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
                {name()}
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
              value={name()}
              onChange={updateLabel}
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
              when={isEditing()}
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
  )
}
