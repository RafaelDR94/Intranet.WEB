import { useState } from 'react'

import type { ListItem } from '../types'

/** Hook to manage selected list item */
export const useList = () => {
  const [selected, setSelected] = useState<ListItem | null>(null)
  return { selected, setSelected }
}
