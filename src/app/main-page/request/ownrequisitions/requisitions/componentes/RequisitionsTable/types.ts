
/**
 * Row shape used by the requisitions table.
 */
export type RequisitionRow = {
  /** Unique identifier for the requisition. */
  id: string
  /** Serial number displayed in the list. */
  snCode: string
  /** Requisition key displayed in table. */
  requisitionkey: string
  /** Name of the debtor associated with the requisition. */
  debtorName: string
  /** Employee full name. */
  employeeName: string
  /** Project code for the requisition. */
  projectCode: string
  /** Project name for the requisition. */
  projectname: string
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
  state?: string
  period?: string
  current_days?: number | string
  phone_number?: string
  email?: string
}

