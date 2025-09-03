
/**
 * Row shape used by the requisitions table.
 */
export type RequisitionRow = {
  /** Unique identifier for the requisition. */
  id: string
  /** Serial number displayed in the list. */
  snCode: string
  /** Name of the debtor associated with the requisition. */
  debtorName: string
  /** Project code for the requisition. */
  projectCode: string
  /** Assignment date (raw ISO or yyyy-mm-dd). */
  assignmentDate?: string
  /** Due date/termino (raw ISO or yyyy-mm-dd). */
  dueDate?: string
  /** Amount deposited/requested as number for formatting. */
  amount?: number
  /** Status text to display as a pill. */
  status?: string
  /** ISO formatted creation date. */
  date_created?: string
  
  state?:string,
}

/** Props for the contextual action cell. */
export type ActionMenuCellProps = {
  /** Current row information. */
  row: RequisitionRow
  /** Called when the edit option is selected. */
  onEdit: (row: RequisitionRow) => void
  /** Called when the delete option is selected. */
  onDelete: (row: RequisitionRow) => void
}
