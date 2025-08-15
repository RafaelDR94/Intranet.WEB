export type BillingImages = {
    "billing_image_id": string,
    "requisition_id": string,
    "status_id": string,
    "Image": string,
    "downloaded": boolean,
    "comments": string
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