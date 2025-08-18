import { BillingDocuments, BillingDocumentsPost, BillingDocumentsPut } from '@/app/mappings/billingdocuments/billingdocuments.types'


// src/app/stores/useBillingDocumentsStore/types.ts
/**
 * Estado para el store de documentos de facturas.
 */
export type BillingDocumentsState = {
  /** Lista de documentos de facturas */
  billingDocuments: BillingDocuments[]
  /** Documento obtenido por ID */
  billingDocument?: BillingDocuments
  /** Flags de proceso */
  loading: boolean
  creating: boolean
  updating: boolean
  removing: boolean

  /** Flags de éxito por operación */
  successGet: boolean
  successGetById: boolean
  successPost: boolean
  successPut: boolean
  successDelete: boolean

  /** Mensaje de error general */
  error?: string
  /** Advertencias retornadas por API */
  warning?: string

  fetchBillingDocuments: (force?: boolean) => Promise<void> | void
  fetchBillingDocumentById: (id: string, force?: boolean) => Promise<BillingDocuments | null>
  createBillingDocument: (payload: BillingDocumentsPost) => Promise<BillingDocuments | null>
  updateBillingDocument: (payload: BillingDocumentsPut) => Promise<BillingDocuments | null>
  deleteBillingDocument: (id: string) => Promise<boolean>

  reset: () => void
  resetFlags: () => void
}
export type Set = (
  partial: Partial<BillingDocumentsState> |
  ((s: BillingDocumentsState) => Partial<BillingDocumentsState>)
) => void
export type Get = () => BillingDocumentsState
