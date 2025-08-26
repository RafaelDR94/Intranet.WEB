import { Requisition, RequitionPost, RequitionPut } from '@/app/mappings/requisitions/requisitions.types'

// src/app/stores/useRequisitionStore/types.ts
/**
 * Estado para el store de requisiciones.
 */
export type RequisitionsState = {
  /** Lista de requisiciones */
  requisitions: Requisition[]
  /** Flags de proceso */
  loading: boolean
  creating: boolean
  updating: boolean
  removing: boolean
  updatingExcel: boolean

  /** Flags de éxito por operación */
  successGet: boolean
  successPost: boolean
  successPut: boolean
  successDelete: boolean
  successUpdateExcel: boolean

  /** Mensaje de error general */
  error?: string
  /** Advertencias retornadas por API */
  warning?: string

  fetchRequisitions: (force?: boolean) => Promise<void> | void
  fetchRequisitionsByDate: (startDate: string, endDate: string, force?: boolean) => Promise<void> | void
  fetchRequisitionsByIdEmployee: (idEmployee: string, force?: boolean) => Promise<void> | void
  createRequisition: (payload: RequitionPost) => Promise<Requisition | null>
  updateRequisition: (payload: RequitionPut) => Promise<Requisition | null>
  deleteRequisition: (id: string) => Promise<boolean>
  updateExcelRequisition: (excel: File) => Promise<Requisition | null>

  reset: () => void
  resetFlags: () => void
}
export type Set = (
  partial: Partial<RequisitionsState> |
  ((s: RequisitionsState) => Partial<RequisitionsState>)
) => void
export type Get = () => RequisitionsState