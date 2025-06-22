import { invoke } from '@tauri-apps/api/core'
import { createStore } from 'solid-js/store'

export type Chronograph = {
  id: number
  workspace_id: number
  name: string
  kind: 'timer' | 'stopwatch'
  state: string
  duration: number
  is_favourite: boolean
  created_at: string
  modified_at: string
}

export const [chronographs, setChronographs] = createStore<Chronograph[]>([])

export async function fetchAllChronographs(payload: {
  workspace_id: number
  kind: Chronograph['kind']
}) {
  const chronographs = await invoke<Chronograph[]>('fetch_all_chronographs', payload)
  setChronographs(chronographs)
  return chronographs
}

export async function addChronograph(
  chronograph: Omit<Chronograph, 'id' | 'created_at' | 'modified_at'>
) {
  setChronographs((prev) => [
    ...prev,
    { ...chronograph, id: (prev[prev.length - 1]?.id ?? -1) + 1 } as Chronograph,
  ])

  await invoke('add_chronograph', { chronograph })
}

export async function deleteChronograph(payload: { workspace_id: number; id: number }) {
  setChronographs((prev) => prev.filter((chronograph) => chronograph.id !== payload.id))
  await invoke('delete_chronograph', payload)
}
