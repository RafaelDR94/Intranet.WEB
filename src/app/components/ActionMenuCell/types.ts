
/** Props for the contextual action cell. */
export type ActionMenuCellProps<T> = {
  /** Current row information. */
  row: T
  /** Called when the edit option is selected. */
  onEdit: (row: T) => void
  /** Called when the delete option is selected. */
  onDelete: (row: T) => void
}