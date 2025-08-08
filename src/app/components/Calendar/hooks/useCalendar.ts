import { useState } from 'react'

/** Hook managing Calendar open state */
export const useCalendar = () => {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}
