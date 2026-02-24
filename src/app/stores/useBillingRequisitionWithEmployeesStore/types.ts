import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import type { BillingImages } from '@/app/mappings/billingimages/billingimages.types'
import type { BillingRequisitionWithEmployees } from '@/app/mappings/billingRequisitionWithEmployees/billingRequisitionWithEmployees.types'

/**
 * Estado del store para BillingRequisitionWithEmployees.
 */
export type BillingRequisitionWithEmployeesState = {
  /** Lista de requisiciones con datos de empleado */
  requisitions: BillingRequisitionWithEmployees[]
  /** Tickets pendientes por empleado */
  pendingBillingImages: BillingImages[]
  /** Facturas pendientes por empleado */
  pendingBillingDocuments: BillingDocuments[]
  /** Empleado actual para tickets pendientes */
  pendingImagesEmployeeId?: string
  /** Empleado actual para facturas pendientes */
  pendingDocumentsEmployeeId?: string
  /** Flags de proceso */
  loading: boolean
  removing: boolean
  loadingPendingImages: boolean
  loadingPendingDocuments: boolean
  /** Flags de éxito */
  successGet: boolean
  successDelete: boolean
  successGetPendingImages: boolean
  successGetPendingDocuments: boolean
  /** Mensajes de error/advertencia */
  error?: string
  warning?: string
  errorPendingImages?: string
  errorPendingDocuments?: string

  fetchRequisitionsWithEmployees: (
    startDate?: string,
    endDate?: string,
    force?: boolean,
  ) => Promise<void> | void
  fetchBillingImagesPendingByEmployee: (
    idEmployee: string,
    force?: boolean,
  ) => Promise<void> | void
  fetchBillingDocumentsPendingByEmployee: (
    idEmployee: string,
    force?: boolean,
  ) => Promise<void> | void
  deleteRequisition: (id: string) => Promise<boolean>
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial:
    | Partial<BillingRequisitionWithEmployeesState>
    | ((s: BillingRequisitionWithEmployeesState) => Partial<BillingRequisitionWithEmployeesState>),
) => void
export type Get = () => BillingRequisitionWithEmployeesState
