import { BillingDocumentDescription, BillingDocuments, BillingDocumentCategory, BillingDocumentsPost, BillingDocumentsPut, BillingDocumentReject, BillingDocumentNotDeductible, ExpenseTypeCatalog, BillingDocumentJsonSapPut } from '@/app/mappings/billingdocuments/billingdocuments.types'

export type BillingDocumentsFilterOptions = {
  filterValue?: '3' | '4' | '5'
  idRequisition?: string
  idEmployee?: string
}

export type SatBillingDocumentsFilterOptions = {
  idRequisition?: string
  idEmployee?: string
}


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
  billingCategories: BillingDocumentCategory[]
  billingDocumentDescription: BillingDocumentDescription[]
  expenseTypeCatalog: ExpenseTypeCatalog[]
  activeDocumentsFilter: BillingDocumentsFilterOptions

  /** Montos del balance de viáticos (por requisición) */
  montoComprobado: number
  montoAFavorEmpresa: number
  montoAFavorColaborador: number
  hasPerDiemTotals: boolean
  
  /** Documento obtenido por ID */
  billingDocument: BillingDocuments | undefined
  /** Flags de proceso */
  loading: boolean
  loadigSat: boolean
  creating: boolean
  updating: boolean
  removing: boolean
  validating: boolean
  rejecting: boolean
  sending: boolean
  notDeducting: boolean
  gettingDescriptions: boolean,
  gettingCategories: boolean,
  gettingExpenseTypeCatalog: boolean
  /** Flags de éxito por operación */
  successGet: boolean
  successGetSat: boolean
  successGetById: boolean
  successPost: boolean
  successPut: boolean
  successDelete: boolean
  succesValidate: boolean
  succesReject: boolean
  succesSend: boolean
  successNotDeductible: boolean
  succesDescriptions: boolean,
  succesCategories: boolean,
  successExpenseTypeCatalog: boolean
  /** Mensaje de error general */
  error?: string
  /** Advertencias retornadas por API */
  warning?: string

  fetchBillingDocuments: (
    force?: boolean,
    filterOptions?: BillingDocumentsFilterOptions,
  ) => Promise<void> | void
  fetchSatBillingDocument: (
    force?: boolean,
    filterOptions?: SatBillingDocumentsFilterOptions,
  ) => Promise<void>
  fetchBillingDocumentById: (id: string, force?: boolean) => Promise<BillingDocuments | null>
  fetchBillingDocumentDescriptions: (id: string, force?: boolean) => Promise<BillingDocuments | null>
  fetchBillingDocumentByIdRequisition: (id: string, force?: boolean) => Promise<BillingDocuments | null>
  fetchBillingDocumentCategories: (force?: boolean) => Promise<BillingDocuments | null>
  fetchExpenseTypeCatalog: (force?: boolean) => Promise<ExpenseTypeCatalog[] | null>
  createBillingDocument: (payload: BillingDocumentsPost) => Promise<BillingDocuments | null>
  updateBillingDocument: (payload: BillingDocumentsPut,idReq?:string) => Promise<BillingDocuments | null>
  deleteBillingDocument: (id: string) => Promise<boolean>
  validateBillingDocument: (ids: string[]) => Promise<BillingDocuments | null>
  validateBillingDocumentOperations: (ids: string[],idReq?:string) => Promise<BillingDocuments | null>
  sendToSapBillingDocument: (ids: string[]) => Promise<BillingDocuments | null>
  updateBillingDocumentJsonSap: (payload: BillingDocumentJsonSapPut) => Promise<boolean>
  rejectBillingDocument: (payload: BillingDocumentReject,idReq?:string) => Promise<boolean>
  billingDocumentNotDeductible: (payload: BillingDocumentNotDeductible) => Promise<BillingDocuments | null>
  reset: () => void
  resetFlags: () => void
}
export type Set = (
  partial: Partial<BillingDocumentsState> |
    ((s: BillingDocumentsState) => Partial<BillingDocumentsState>)
) => void
export type Get = () => BillingDocumentsState
