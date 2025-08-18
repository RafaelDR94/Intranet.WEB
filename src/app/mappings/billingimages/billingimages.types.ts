
import { Requisition } from "../requisitions/requisitions.types"
export type BillingImages = {
    "billing_image_id": string,
    "requisition": Requisition,
    "status": string,
    "Image": string,
    "comments": string,
    "dateCreate": string
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
}
export type BillingPost = {
    "requisition_id": string,
    "Image": string
}
export type BillingPut = {
    "billing_image_id": string,
    "requisition_id": string,
    "Image": string,
    "comments": string
}
export type BillinReject = {
    "billing_image_id": string,
    "comments": string
}