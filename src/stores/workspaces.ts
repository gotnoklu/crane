import { invoke } from '@tauri-apps/api/core'
import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'

export type Workspace = {
  id: number
  title: string
  description: string
  is_favourite: boolean
  is_selected: boolean
  created_at: Date
  modified_at: Date
  deleted_at: Date | null
}

export const [currentWorkspace, setCurrentWorkspace] = createSignal<Workspace | null>(null)
export const [workspaces, setWorkspaces] = createStore<Workspace[]>([])

export async function fetchCurrentWorkspace() {
  let workspace = currentWorkspace()
  if (!workspace) {
    workspace = workspaces.find((workspace) => workspace.is_selected === true) ?? null
    if (!workspace) {
      workspace = await invoke<Workspace>('fetch_current_workspace')
    }
    setCurrentWorkspace(workspace)
  }
  return workspace
}

export async function addWorkspace(
  workspace: Omit<Workspace, 'id' | 'created_at' | 'modified_at' | 'deleted_at'>
) {
  setWorkspaces((prev) => [
    ...prev,
    { ...workspace, id: prev[prev.length - 1].id + 1 } as Workspace,
  ])

  return await invoke<boolean>('add_workspace', { workspace })
}

export async function fetchAllWorkspaces() {
  const workspaces = await invoke<Workspace[]>('fetch_all_workspaces')
  setCurrentWorkspace(workspaces.find((workspace) => workspace.is_selected === true) ?? null)
  return setWorkspaces(workspaces)
}

export async function updateWorkspace(payload: { id: number; workspace: Partial<Workspace> }) {
  const { id } = payload

  setWorkspaces((prev) => {
    let index = 0
    let item
    for (index; index < prev.length; index++) {
      item = prev[index]
      if (item.id === id) {
        prev[index] = { ...item, ...payload.workspace }
        if (payload.workspace.is_selected === true) {
          setCurrentWorkspace(prev[index])
        }
      }
    }

    return prev.slice()
  })

  return await invoke<boolean>('update_workspace', payload)
}

export async function deleteWorkspace(id: number) {
  setWorkspaces((prev) => prev.filter((workspace) => workspace.id !== id))
  return await invoke<boolean>('delete_workspace', { id })
}
