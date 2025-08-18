import type { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types'

// src/app/stores/useBillingHistoryStore/types.ts
/**
 * Estado del store de historial de facturación.
 */
export type BillingHistoryState = {
  /** Lista de registros de historial */
  history: HistoryRow[]
  /** Indica si hay petición en curso */
  loading: boolean
  /** Mensaje de error de la última operación */
  error?: string

  /** Obtiene el historial desde el backend */
  fetchBillingHistory: (idEmployee:string,force?: boolean) => Promise<void>
  /** Forza el refetch ignorando la cache */
  forceFetchBillingHistory: (idEmployee:string) => Promise<void>
  /** Limpia el estado */
  reset: () => void
}

export type Set = (
  partial:
    | Partial<BillingHistoryState>
    | ((s: BillingHistoryState) => Partial<BillingHistoryState>)
) => void

export type Get = () => BillingHistoryState
