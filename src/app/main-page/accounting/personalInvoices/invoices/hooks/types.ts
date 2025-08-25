
import { FieldModel } from "@/app/components/DynamicForm/types"
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types"
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types"

export interface InitInvoicesForms {
    initialformFields: FieldModel[]
    field: FieldModel[]
    formId: string
    dataEdit?: HistoryRow | null
    billingImages?: BillingImagesTable | null
}