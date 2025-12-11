import { Requisition, RequitionPost, RequitionPut } from '@/app/mappings/requisitions/requisitions.types'

// src/app/stores/useRequisitionStore/types.ts
/**
 * Estado para el store de requisiciones.
 */
export type RequisitionsState = {
  /** Lista de requisiciones */
  requisitions: Requisition[]
  currentRequisition: Requisition | null
  /** Flags de proceso */
  loading: boolean
  creating: boolean
  updating: boolean
  removing: boolean
  updatingExcel: boolean
  gettincurrentReq: boolean
  downloadingDocument: boolean

  /** Flags de éxito por operación */
  successGet: boolean
  successPost: boolean
  successPut: boolean
  successDelete: boolean
  successUpdateExcel: boolean
  succesgetingCurrent: boolean
  succesDownloadDocument: boolean
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
  downloadRequistionResume: (idRequisition: string) => Promise<boolean>
  updateExcelRequisition: (excel: File) => Promise<Requisition | null>
  fetchCurrentRequisition: (id: string, force?: boolean) => Promise<void> | void
  reset: () => void
  resetFlags: () => void
  resetCurrentReq: () => void
}
export type Set = (
  partial: Partial<RequisitionsState> |
    ((s: RequisitionsState) => Partial<RequisitionsState>)
) => void
export type Get = () => RequisitionsState