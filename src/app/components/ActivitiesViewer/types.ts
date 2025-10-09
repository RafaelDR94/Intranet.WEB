import type { ActionMenuCellProps } from '../ActionMenuCell/types'

export type ActivitiesViewerItem<TRow = unknown> = {
  title: string
  description?: string
  image?: string
  actionMenuProps?: ActionMenuCellProps<TRow>
}

export interface ActivitiesViewerProps<TRow = unknown> {
  items: ActivitiesViewerItem<TRow>[]
  dataTestId?: string
  maxWidthClassName?: string // e.g. max-w-6xl
  /** Opcional: forzar columnas (1..3). Útil para tests o contenedores especiales */
  columns?: number
  forcevertical?: boolean
  forcehorizontal?: boolean
}
