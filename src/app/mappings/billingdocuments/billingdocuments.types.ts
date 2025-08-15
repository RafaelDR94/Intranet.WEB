export type BillingDocuments = {
  "billingdocument_id": string,
  "requisition_id": string,
  "billingimages_id": string,
  "xml": string,
  "pdf": string,
  "status_id": string,
  "downloaded": boolean,
  "validate": boolean,
  "comments": string
}
export type BillingDocumentsPost = {
  "requisition_id": string,
  "billingimages_id": string,
  "xml": string,
  "pdf": string,
  "comments": string
}
export type BillingDocumentsPut = {
  "billingdocument_id": string,
  "requisition_id": string,
  "billingimages_id": string,
  "xml": string,
  "pdf": string,
  "status_id": string,
  "downloaded": boolean,
  "validate": boolean,
  "comments": string
}