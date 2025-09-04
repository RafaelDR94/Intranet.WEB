import { FieldModel } from "@/app/components/DynamicForm/types";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { BillingImagesTable } from "@/app/mappings/billingimages/billingimages.types";

/** Options for {@link useInitInvoicesForms}. */
export interface InitInvoicesForms {
    /** Initial fields to load into the form. */
    initialformFields: FieldModel[];
    /** Current field models from store. */
    field: FieldModel[];
    /** Identifier for form fields. */
    formId: string;
    /** Row to edit when applicable. */
    dataEdit?: HistoryRow | null;
    /** Images from ticket uploads. */
    billingImages?: BillingImagesTable | null;
}
