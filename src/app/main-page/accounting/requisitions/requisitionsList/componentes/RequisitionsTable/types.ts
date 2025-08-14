import { RequisitionInitialValues } from "../../../components/RequisitionsForm/hooks/useRequisitionsForm"
export type RequisitionRow = {
  id: string
  snCode: string
  debtorName: string
  projectCode: string
}

export type ActionMenuCellProps = {
  row: RequisitionRow
  onEdit: (row: RequisitionRow) => void
  onDelete: (row: RequisitionRow) => void
}
export type RequisitionsTableProps = {
  /** el padre abre el formulario con estos valores */
  onEditRequest: (initial: RequisitionInitialValues) => void
}
