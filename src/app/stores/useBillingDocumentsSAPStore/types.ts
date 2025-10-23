import type { BillingDocumentFull } from '@/app/mappings/billingdocuments/billingdocuments.types'

export type BillingDocumentsSAPState = {
  /** Lista de todos los documentos obtenidos desde SAP */
  billingDocuments: BillingDocumentFull[]
  /** Estado de carga */
  loading: boolean
  /** Bandera de éxito en la última petición */
  successGet: boolean
  /** Error de la última petición, si existe */
  error?: string
  /** Acción para obtener documentos desde SAP */
  fetchBillingDocumentsSAP: (force?: boolean) => Promise<void>
  /** Reinicia todo el estado */
  reset: () => void
  /** Reinicia solo las banderas de estado (loading, success, error) */
  resetFlags: () => void
}

export type Set = (
  partial:
    | Partial<BillingDocumentsSAPState>
    | ((state: BillingDocumentsSAPState) => Partial<BillingDocumentsSAPState>)
) => void

export type Get = () => BillingDocumentsSAPState
