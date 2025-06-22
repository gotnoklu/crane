import {
  type Accessor,
  createContext,
  createSignal,
  type JSX,
  type Setter,
  useContext,
} from 'solid-js'

export interface TabProviderProps {
  children: JSX.Element
}

const TabContext = createContext<{ index: Accessor<number>; setIndex: Setter<number> }>({
  index: () => 0,
  setIndex() {
    return 0
  },
})

export function useTabs() {
  return useContext(TabContext)
}

export function TabProvider(props: TabProviderProps) {
  const [index, setIndex] = createSignal(0)
  return <TabContext.Provider {...props} value={{ index, setIndex }} />
}
