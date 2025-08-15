import { FieldModel } from "@/app/components/DynamicForm/types";
import { useInvoices } from "../context/InvoicesContext";
import { useMemo, useEffect, useRef, useState } from "react";
import { Requisition } from "@/app/mappings/requisitions/requisitions.types";



interface InitInvoicesForms {
    initialformFields: FieldModel[]
    field: FieldModel[]
    formId: string
}

const useInitInvoicesForms = ({ initialformFields, field, formId }: InitInvoicesForms) => {
    const { user, requisitions, setFields, updateField, resetFields } = useInvoices();
    const submitRef = useRef<() => void | Promise<void>>(null)
    const [formReady, setFormReady] = useState(false)
    const fieldsReady = field.length > 0;
    useEffect(() => {
        if (user && fieldsReady) {
            updateField(formId, 'debtorName', { value: user.fullName });
        }
    }, [user?.fullName, fieldsReady, formId]);

    useEffect(() => {
        const initialFields: FieldModel[] = initialformFields;
        setFields(formId, initialFields);
        return () => {
            resetFields(formId);
            //resetFlags();
        };
    }, [formId]);


    useEffect(() => {
        updateField(formId, 'requisition', {
            options: requisitions.map((r: Requisition) => ({
                label: r.requisitionkey,
                value: r.billingrequisition_id,
            })),
        });
    }, [requisitions]);

    const computeLoadingFormInfo = (fields: FieldModel[]) => {
        console.log("fields", fields);
        const req = fields.find(f => f.name === 'requisition');

        const debtorName = fields.find(f => f.name === 'debtorName');
        const hasDebtor = Boolean(debtorName);
        const reqReady = Array.isArray(req?.options) && (req?.options?.length ?? 0) > 0;

        return !(reqReady  && (debtorName?.value || !hasDebtor ));
    };

    const loadingFormInfo = useMemo(() => computeLoadingFormInfo(field), [field]);

    return { loadingFormInfo, submitRef, formReady, setFormReady }

}
export default useInitInvoicesForms;