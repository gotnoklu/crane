import { invoke } from '@tauri-apps/api/core'
import { createStore } from 'solid-js/store'

export type Chronograph = {
  id: string
  workspace_id: number
  name: string
  kind: 'timer' | 'stopwatch'
  state: 'paused' | 'active'
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

  return await invoke<Chronograph>('add_chronograph', { chronograph })
}

export async function updateChronograph(payload: {
  workspace_id: number
  id: string
  chronograph: Partial<Omit<Chronograph, 'id' | 'workspace_id' | 'created_at' | 'modified_at'>>
}) {
  const { id } = payload

  setChronographs((prev) => {
    let index = 0
    let item
    for (index; index < prev.length; index++) {
      item = prev[index]
      if (item.id === id) {
        prev[index] = { ...item, ...payload.chronograph }
      }
    }

    return prev.slice()
  })

  return await invoke<boolean>('update_chronograph', payload)
}

export async function deleteChronograph(payload: { workspace_id: number; id: string }) {
  setChronographs((prev) => prev.filter((chronograph) => chronograph.id !== payload.id))
  return await invoke<boolean>('delete_chronograph', payload)
}
