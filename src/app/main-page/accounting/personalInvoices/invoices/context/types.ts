import { User } from '@/app/context/AuthContext/types';
import { Requisition } from '@/app/mappings/requisitions/requisitions.types';
import { FieldModel } from '@/app/components/DynamicForm/types';
import { BillingDocumentDescription,BillingDocumentCategory } from '@/app/mappings/billingdocuments/billingdocuments.types';
export interface InvoicesContextType {

    requisitions: Requisition[];
    billingDocumentDescription: BillingDocumentDescription[];
    billingCategories: BillingDocumentCategory[];
    field1: FieldModel[];
    field2: FieldModel[];
    formId1: string;
    formId2: string;
    setFields: (formId: string, newFields: FieldModel[]) => void;
    updateField: (formId: string, name: string, changes: Partial<FieldModel>) => void;
    resetFields: (formId: string) => void;
    user: User | null
}