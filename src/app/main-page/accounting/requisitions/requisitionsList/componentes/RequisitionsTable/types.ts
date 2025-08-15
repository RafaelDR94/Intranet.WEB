import { RequisitionInitialValues } from '../../../components/RequisitionsForm/hooks/useRequisitionsForm'

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
  /** ISO formatted creation date. */
  date_created?: string
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

export type RequisitionsTableProps = {
  /** Parent callback to open the edit form with initial values. */
  onEditRequest: (initial: RequisitionInitialValues) => void
}
