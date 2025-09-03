import { User } from '@/app/context/AuthContext/types';
import { Requisition } from '@/app/mappings/requisitions/requisitions.types';
import { FieldModel } from '@/app/components/DynamicForm/types';
import { BillingDocumentDescription, BillingDocumentCategory } from '@/app/mappings/billingdocuments/billingdocuments.types';

/** Shape of the invoices context. */
export interface InvoicesContextType {
    /** Available requisitions. */
    requisitions: Requisition[];
    /** List of descriptions. */
    billingDocumentDescription: BillingDocumentDescription[];
    /** List of categories. */
    billingCategories: BillingDocumentCategory[];
    /** Fields for invoices form. */
    field1: FieldModel[];
    /** Fields for ticket form. */
    field2: FieldModel[];
    /** Identifier for invoices form. */
    formId1: string;
    /** Identifier for ticket form. */
    formId2: string;
    /** Setter to replace fields. */
    setFields: (formId: string, newFields: FieldModel[]) => void;
    /** Update a single field. */
    updateField: (formId: string, name: string, changes: Partial<FieldModel>) => void;
    /** Reset fields by form id. */
    resetFields: (formId: string) => void;
    /** Authenticated user. */
    user: User | null;
}
