import { BillingDocuments, BillingDocumentsPost, BillingDocumentsPut, BillingDocumentReject } from '@/app/mappings/billingdocuments/billingdocuments.types'


// src/app/stores/useBillingDocumentsStore/types.ts
/**
 * Estado para el store de documentos de facturas.
 */
export type BillingDocumentsState = {
  /** Lista de documentos de facturas */
  billingDocuments: BillingDocuments[]
  billingDocumentnotToday: BillingDocuments[]
  billingDocumentsValid: BillingDocuments[]
  billingDocumentsNotValid: BillingDocuments[]
  billingDocumentsBadCode: BillingDocuments[]
  billingDocumentsEfos: BillingDocuments[]
  /** Documento obtenido por ID */
  billingDocument?: BillingDocuments
  /** Flags de proceso */
  loading: boolean
  loadigSat:boolean
  creating: boolean
  updating: boolean
  removing: boolean
  validating: boolean
  rejecting: boolean
  sending:boolean

  /** Flags de éxito por operación */
  successGet: boolean
  successGetSat: boolean
  successGetById: boolean
  successPost: boolean
  successPut: boolean
  successDelete: boolean
  succesValidate: boolean
  succesReject: boolean
  succesSend:boolean

  /** Mensaje de error general */
  error?: string
  /** Advertencias retornadas por API */
  warning?: string

  fetchBillingDocuments: (force?: boolean) => Promise<void> | void
  fetchSatBillingDocument: ( force?: boolean) => Promise<void>
  fetchBillingDocumentById: (id: string, force?: boolean) => Promise<BillingDocuments | null>
  createBillingDocument: (payload: BillingDocumentsPost) => Promise<BillingDocuments | null>
  updateBillingDocument: (payload: BillingDocumentsPut) => Promise<BillingDocuments | null>
  deleteBillingDocument: (id: string) => Promise<boolean>
  validateBillingDocument: (ids: string[]) => Promise<BillingDocuments | null>
  sendToSapBillingDocument: (ids: string[]) => Promise<BillingDocuments | null>
  rejectBillingDocument: (payload: BillingDocumentReject) => Promise<boolean>
  reset: () => void
  resetFlags: () => void
}
export type Set = (
  partial: Partial<BillingDocumentsState> |
    ((s: BillingDocumentsState) => Partial<BillingDocumentsState>)
) => void
export type Get = () => BillingDocumentsState
