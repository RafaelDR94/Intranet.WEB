import type { BillingImagesByEmployee } from '@/app/mappings/billingimages/billingimages.types'

/**
 * Estado para el store de imÃ¡genes de facturas por empleado.
 */
export type BillingImagesByEmployeeState = {
  /** Lista de imÃ¡genes del empleado */
  billingImagesByEmployee: BillingImagesByEmployee[]
  /** Flags de proceso */
  loading: boolean

  /** Flags de Ã©xito por operaciÃ³n */
  successGet: boolean

  /** Mensaje de error general */
  error?: string

  fetchBillingImagesByEmployee: (idEmployee: string, force?: boolean) => Promise<void> | void
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial: Partial<BillingImagesByEmployeeState> |
  ((s: BillingImagesByEmployeeState) => Partial<BillingImagesByEmployeeState>)
) => void

export type Get = () => BillingImagesByEmployeeState
