import type { BillingAllDocumentsByEmployee } from "@/app/mappings/billingalldocuments/billingalldocuments.types"

/**
 * Estado para el store de documentos de facturacion por empleado.
 */
export type BillingAllDocumentsByEmployeeState = {
  /** Lista de documentos del empleado */
  billingDocumentsByEmployee: BillingAllDocumentsByEmployee[]
  /** Flags de proceso */
  loading: boolean

  /** Flags de exito por operacion */
  successGet: boolean

  /** Mensaje de error general */
  error?: string

  fetchBillingAllDocumentsByEmployee: (idEmployee: string, force?: boolean) => Promise<void> | void
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial: Partial<BillingAllDocumentsByEmployeeState> |
  ((s: BillingAllDocumentsByEmployeeState) => Partial<BillingAllDocumentsByEmployeeState>)
) => void

export type Get = () => BillingAllDocumentsByEmployeeState
