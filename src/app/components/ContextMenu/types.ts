import type { ReactNode } from 'react'

/** Single menu item */
export interface MenuItem {
  /** Display label */
  label: string
  /** Disable interaction */
  disabled?: boolean
  /** Mark item as dangerous */
  danger?: boolean
  /** Click callback */
  onClick?: () => void
}

/** Props for ContextMenu component */
export interface ContextMenuProps {
  /** Trigger element */
  trigger: ReactNode
  /** Menu item list */
  items: MenuItem[]
  /** Controlled open state */
  isOpen?: boolean
  /** Setter for open state */
  setIsOpen?: (open: boolean) => void
}
