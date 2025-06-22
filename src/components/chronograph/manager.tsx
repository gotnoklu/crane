import { Button, Container, Grid, Stack, SvgIcon, Toolbar, Typography } from '@suid/material'
import { createMemo, For, createEffect, Show } from 'solid-js'
import { createStore } from 'solid-js/store'
import TimeGraph, { type TimeGraphProps } from './time-graph'
import { IconHourglassHigh, IconPlus, IconStopwatch } from '@tabler/icons-solidjs'
import {
  addChronograph,
  type Chronograph,
  deleteChronograph,
  fetchAllChronographs,
} from '../../stores/chronographs'
import { toMilliseconds } from '../../utilities'
import { currentWorkspace, fetchCurrentWorkspace } from '../../stores/workspaces'
import { useTabs } from '../tabs/provider'

const [graphs, setGraphs] = createStore(
  [] as Omit<TimeGraphProps, 'created_at' | 'modified_at' | 'onClose'>[]
)

export default function TimeGraphManager() {
  const tabs = useTabs()
  const isTimer = createMemo(() => tabs.index() === 0)

  createEffect(() => {
    const kind = isTimer() ? 'timer' : 'stopwatch'

    fetchCurrentWorkspace().then((workspace) => {
      console.log({ workspace })
      fetchAllChronographs({
        workspace_id: workspace.id,
        kind,
      }).then((chronographs) => {
        setGraphs(chronographs)
      })
    })
  })

  async function addTimeGraph() {
    const shouldAddTimer = isTimer()
    const name = shouldAddTimer ? 'Timer' : 'Stopwatch'
    const kind = shouldAddTimer ? 'timer' : 'stopwatch'
    const duration = toMilliseconds(shouldAddTimer ? 1 : 0, 0, 0)

    const graph: Omit<Chronograph, 'created_at' | 'modified_at'> = {
      id: (graphs[0]?.id ?? -1) + 1,
      workspace_id: currentWorkspace()?.id as number,
      name,
      kind,
      duration,
      state: 'paused',
      is_favourite: false,
    }

    setGraphs((graphs) => {
      if (graphs.length === 0) {
        return [{ ...graph, enlarged: true }]
      }

      if (graphs[0]?.enlarged) {
        return [
          { ...graphs[0], enlarged: false },
          { ...graph, enlarged: true },
        ]
      }

      return [...graphs, { ...graph, enlarged: true }]
    })

    await addChronograph(graph)
  }

  async function removeTimeGraph(index: number) {
    const id = graphs[index].id
    setGraphs((graphs) => {
      graphs.splice(index, 1)
      if (graphs.length === 1) {
        graphs[0] = { ...graphs[0], enlarged: true }
      }
      return graphs.slice()
    })

    await deleteChronograph({ workspace_id: currentWorkspace()?.id as number, id })
  }

  return (
    <Stack flex={1} gap={2} height="100%">
      <Toolbar sx={{ justifyContent: 'flex-end' }}>
        <SvgIcon sx={{ color: 'text.secondary', marginRight: 2 }}>
          <Show when={isTimer()} fallback={<IconStopwatch />}>
            <IconHourglassHigh />
          </Show>
        </SvgIcon>
        <Typography variant="body1" color="text.secondary" fontWeight="medium" sx={{ flex: 1 }}>
          <Show when={isTimer()} fallback="Stopwatches">
            Timers
          </Show>
        </Typography>
        <Button
          variant="contained"
          startIcon={
            <SvgIcon>
              <IconPlus />
            </SvgIcon>
          }
          onClick={addTimeGraph}
        >
          Add{' '}
          <Show when={isTimer()} fallback="Stopwatch">
            Timer
          </Show>
        </Button>
      </Toolbar>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          alignItems: graphs.length > 1 ? 'flex-start' : 'center',
          justifyContent: graphs.length > 1 ? 'flex-start' : 'center',
          height: '100%',
        }}
      >
        <Grid container spacing={4} sx={{ width: graphs.length > 1 ? '100%' : 'max-content' }}>
          <For
            each={graphs}
            fallback={
              <Grid item xs={12}>
                <Stack alignItems="center" gap={2}>
                  <Show
                    when={isTimer()}
                    fallback={<IconStopwatch color="rgba(150, 150, 150, 0.4)" size={96} />}
                  >
                    <IconHourglassHigh color="rgba(150, 150, 150, 0.4)" size={96} />
                  </Show>
                  <Typography color="text.secondary">All done here!</Typography>
                </Stack>
              </Grid>
            }
          >
            {(graph, index) => {
              return (
                <Grid item xl={3} lg={4} md={4} sm={6} xs={12}>
                  <TimeGraph
                    id={graph.id}
                    workspace_id={graph.workspace_id}
                    name={graph.name}
                    kind={graph.kind}
                    state={graph.state}
                    is_favourite={graph.is_favourite}
                    enlarged={graph.enlarged}
                    duration={graph.duration}
                    onClose={graphs.length > 1 ? () => removeTimeGraph(index()) : undefined}
                  />
                </Grid>
              )
            }}
          </For>
        </Grid>
      </Container>
    </Stack>
  )
}
