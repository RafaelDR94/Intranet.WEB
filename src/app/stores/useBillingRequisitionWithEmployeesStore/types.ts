import type { BillingRequisitionWithEmployees } from '@/app/mappings/billingRequisitionWithEmployees/billingRequisitionWithEmployees.types'

/**
 * Estado del store para BillingRequisitionWithEmployees.
 */
export type BillingRequisitionWithEmployeesState = {
  /** Lista de requisiciones con datos de empleado */
  requisitions: BillingRequisitionWithEmployees[]
  /** Flags de proceso */
  loading: boolean
  removing: boolean
  /** Flags de éxito */
  successGet: boolean
  successDelete: boolean
  /** Mensajes de error/advertencia */
  error?: string
  warning?: string

  fetchRequisitionsWithEmployees: (
    startDate?: string,
    endDate?: string,
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
