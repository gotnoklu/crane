import { styled } from '@suid/material'
import Button, { type ButtonProps } from '@suid/material/Button'
import { onMount } from 'solid-js'
import { useTabs } from './provider'

export interface TabProps extends ButtonProps {
  index: number
}

const StyledTab = styled(Button)<TabProps>(({ theme }) => ({
  width: 'max-content',
  color: theme.palette.grey[500],
  borderRadius: theme.shape.borderRadius * 2,
  transition: `color ${theme.transitions.duration.short}ms`,
  '&[data-active]': {
    color: theme.palette.primary.main,
  },
}))

export default function Tab(props: TabProps) {
  const { setIndex } = useTabs()

  let tabParent!: HTMLElement
  let tabElement!: HTMLButtonElement

  function updateTabStyles(parent: HTMLElement, tab: HTMLButtonElement) {
    const { width, left: tabLeft } = tab.getBoundingClientRect()
    const tabsBoxLeft = tabParent.getBoundingClientRect().left
    const left = tabLeft - tabsBoxLeft
    parent.style.setProperty('--tab-indicator-offset', `${left}px`)
    parent.style.setProperty('--tab-indicator-width', `${width}px`)
    tab.setAttribute('data-active', '')
  }

  function onTabClick(
    event: MouseEvent & {
      currentTarget: HTMLButtonElement
      target: Element
    }
  ) {
    const currentTab = event.currentTarget
    const allTabs = tabParent?.querySelectorAll('.tab')
    allTabs?.forEach((tab) => tab.removeAttribute('data-active'))
    updateTabStyles(tabParent, currentTab)
    setIndex(props.index)
  }

  onMount(() => {
    tabParent = tabElement.parentElement as HTMLElement
    const currentTab = tabParent.querySelector('.tab') as HTMLButtonElement
    updateTabStyles(tabParent, currentTab)
  })

  return (
    <StyledTab {...props} ref={tabElement} component="button" class="tab" onClick={onTabClick} />
  )
}
