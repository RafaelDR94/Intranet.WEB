import type { Authorization } from "../authorizations/authorizations.types"
import type { BillingDocumentFull,BillingDocuments} from "../billingdocuments/billingdocuments.types"
import type { BillingImages } from "../billingimages/billingimages.types"
export type BillingAllDocumentsByEmployee = {
  id: string
  billingdocument: BillingDocuments|null
  billingimage: BillingImages|null
  dateCreated: string
  category: string
  status: string
  comments?: string
  proyect:string
  xml: string|null
  pdf: string|null
  image: string|null
  requisitonkey: string|null
}

/**
 * Documento completo de facturación obtenido por requisición.
 */
export type BillingAllDocumentsByRequisition = BillingDocumentFull & {
  authorization?: Authorization | null
}
