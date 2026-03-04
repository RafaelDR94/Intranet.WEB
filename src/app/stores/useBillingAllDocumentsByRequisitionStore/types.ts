import type { BillingAllDocumentsByRequisition } from "@/app/mappings/billingalldocuments/billingalldocuments.types"

/**
 * Estado para el store de documentos completos por requisición.
 */
export type BillingAllDocumentsByRequisitionState = {
  /** Documento completo asociado a la requisición */
  billingDocumentByRequisition: BillingAllDocumentsByRequisition | null
  /** Flags de proceso */
  loading: boolean
  /** Flags de éxito por operación */
  successGet: boolean
  /** Mensaje de error general */
  error?: string

  fetchBillingAllDocumentByRequisition: (
    idRequisition: string,
    force?: boolean,
  ) => Promise<BillingAllDocumentsByRequisition | null> | void
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial:
    | Partial<BillingAllDocumentsByRequisitionState>
    | ((
        s: BillingAllDocumentsByRequisitionState,
      ) => Partial<BillingAllDocumentsByRequisitionState>)
) => void

export type Get = () => BillingAllDocumentsByRequisitionState
