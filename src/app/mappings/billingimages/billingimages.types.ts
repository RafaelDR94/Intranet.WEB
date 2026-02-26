
import { BillingDocumentCategory, BillingDocumentDescription } from "../billingdocuments/billingdocuments.types"
import { Requisition } from "../requisitions/requisitions.types"

export type BillingImageItem = {
    "image": string,
    "status_id"?: string,
}
export type BillingImages = {
    "billing_image_id": string,
    "requisition": Requisition,
    "status": string,
    "images": BillingImageItem[],
    "comments": string,
    "user_comments"?: string,
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
    "images": string[],
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
    "employee_id": string,
    "requisition_id"?: string,
    "category_id": string,
    "images": string[]
    "description": string,
    "numpersons": string,
    "numnights": string,

}
export type BillingPut = {
    "billing_image_id": string,
    "requisition_id": string,
    "category_id": string,
    "description": string,
    "images": string[],
    "comments": string
    "user_comments": string
    "numnights": string
    "numpersons": string,
}
export type BillinReject = {
    "billing_image_id": string,
    "comments": string
}

export type BillingImageEmployee = {
    "employee_id": string,
    "employee_number": string,
    "firstname": string,
    "secondname": string,
    "lastname": string,
    "motherlast_name": string,
    "gender": string,
    "email": string,
    "phone_number": string,
    "extension": string,
    "image_url": string,
    "user_id": string,
    "workposition_id": string,
    "manager_id": string,
    "department_id": string,
    "role_id": string | null,
    "fullname": string,
}

export type BillingImagesByEmployee = {
    "billing_image_id": string,
    "employee": BillingImageEmployee,
    "category": BillingDocumentCategory,
    "description": BillingDocumentDescription,
    "numpersons": number,
    "numnights": number,
    "status": string,
    "images": BillingImageItem[],
    "comments": string,
    "user_comments"?: string,
    "dateCreate": string,
}
