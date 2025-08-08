import type { ListItem } from '../types'

/** Example helper for List component */
export const getLabels = (items: ListItem[]) => items.map((i) => i.label)
