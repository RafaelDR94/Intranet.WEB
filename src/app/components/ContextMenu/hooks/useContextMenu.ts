import { useState } from 'react'

/** Hook to manage context menu open state */
export const useContextMenu = () => {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen((o) => !o)
  return { open, toggle }
}
