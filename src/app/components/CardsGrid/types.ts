import type { ActionMenuCellProps } from "../ActionMenuCell/types"

export type KeyOrFn<T> = keyof T | ((row: T) => string)

export type CardsGridProps<T> = {
  data: T[]
  adapt: {
    titleKey: KeyOrFn<T>
    labelKey?: KeyOrFn<T>
    descriptionKey?: KeyOrFn<T>
    imageKey?: KeyOrFn<T>
    onPrimaryAction: (row: T) => void
    primaryLabel?: string
    onSecondaryAction?: (row: T) => void
    secondaryLabel?: string
    showPrimaryButton?: boolean
    showSecondaryButton?: boolean
    /** Menú contextual por tarjeta */
    actionMenuProps?: (row: T) => ActionMenuCellProps<T>
    /** si lo envías y es menor, se respeta (pero nunca más de 2 filas) */
    cardsPerPage?: number
  }
  /** fallback cuando el adaptador no lo indica */
  rowsPerPage?: number
}
