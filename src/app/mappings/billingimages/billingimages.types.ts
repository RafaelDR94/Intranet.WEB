
import { Requisition } from "../requisitions/requisitions.types"
import { BillingDocumentCategory, BillingDocumentDescription } from "../billingdocuments/billingdocuments.types"
export type BillingImages = {
    "billing_image_id": string,
    "requisition": Requisition,
    "status": string,
    "Image": string,
    "comments": string,
    "dateCreate": string,
    "category": BillingDocumentCategory
    "description": BillingDocumentDescription
    "numpersons": number
    "numnights": number
}
export type BillingImagesTable = {
    "id": string,
    "billing_image_id": string,
    "deudor": string,
    "proyect": string,
    "Image": string,
    "comments": string,
    "dateCreate": string,
    "requisition_id": string,
    "category": BillingDocumentCategory
    "description": BillingDocumentDescription
    "numpersons": number
    "numnights": number
    "requisitionkey": string,
    "categoryName":string,
    "descriptionName":string,
}
export type BillingPost = {
    "requisition_id": string,
    "category_id": string,
    "Image": string
    "description": string,
    "numpersons": string,
    "numnights": string,

}
export type BillingPut = {
    "billing_image_id": string,
    "requisition_id": string,
    "category_id": string,
    "description": string,
    "Image": string,
    "comments": string
    "user_comments": string
    "numnights": string
    "numpersons": string,
}
export type BillinReject = {
    "billing_image_id": string,
    "comments": string
}