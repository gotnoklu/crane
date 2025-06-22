import { createContext, type JSX, useContext } from 'solid-js'

export interface TimeGraphProviderProps {
  graph: Chronograph & { enlarged: boolean }
  children: JSX.Element
}

const TimerContext = createContext<Chronograph & { enlarged: boolean }>({
  id: '',
  enlarged: false,
})

export function useTimer() {
  return useContext(TimerContext)
}

export function TimeGraphProvider(props: TimeGraphProviderProps) {
  return <TimerContext.Provider {...props} value={props.graph} />
}
