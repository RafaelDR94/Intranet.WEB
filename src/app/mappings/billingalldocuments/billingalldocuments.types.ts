import type { Authorization } from "../authorizations/authorizations.types"
import type { BillingDocumentFull, BillingDocuments } from "../billingdocuments/billingdocuments.types"

export type BillingAllDocumentsByEmployee = BillingDocuments

/**
 * Documento completo de facturación obtenido por requisición.
 */
export type BillingAllDocumentsByRequisition = BillingDocumentFull & {
  authorization?: Authorization | null
}
