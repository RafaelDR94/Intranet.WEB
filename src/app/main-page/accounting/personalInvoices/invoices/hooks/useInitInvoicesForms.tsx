import { FieldModel } from "@/app/components/DynamicForm/types";
import { useInvoices } from "../context/InvoicesContext";
import { useMemo, useEffect, useRef, useState } from "react";
import { Requisition } from "@/app/mappings/requisitions/requisitions.types";
import { InitInvoicesForms } from "./types";
import { b } from "vitest/dist/chunks/suite.d.FvehnV49.js";



const useInitInvoicesForms = ({ initialformFields, field, formId, dataEdit, billingImages }: InitInvoicesForms) => {
    const { user, requisitions, setFields, updateField, resetFields } = useInvoices();
    const submitRef = useRef<() => void | Promise<void>>(null)
    const [formReady, setFormReady] = useState(false)
    const fieldsReady = field.length > 0;

    const ResetForm = () => {
        const initialFields: FieldModel[] = initialformFields;
        setFields(formId, initialFields);
        setTimeout(() => {
            setUser();
            SetInitRequisitions();
        }, 500)

    }
    const setUser = () => {
        if (user && fieldsReady) {
            updateField(formId, 'debtorName', { value: user.fullName });
        }
    }
    const SetInitRequisitions = () => {
        updateField(formId, 'requisition', {
            options: requisitions.map((r: Requisition) => ({
                label: r.requisitionkey + " - " + r.projectname,
                value: r.billingrequisition_id,
            })),

            onChange: (value) => {
                const employeeName = requisitions.find(r => r.billingrequisition_id === value)?.employeename
                const debtorName = field.find(f => f.name === 'personName');
                if (debtorName) {
                    updateField(formId, 'personName', { value: employeeName });
                    updateField(formId, 'requisition', { value: value });
                }
            },
        });
    }
    useEffect(() => {
        setUser();
    }, [user?.fullName, fieldsReady, formId]);

    useEffect(() => {
        const initialFields: FieldModel[] = initialformFields;
        setFields(formId, initialFields);
        return () => {
            resetFields(formId);
            SetInitRequisitions();

        };
    }, [formId]);




    useEffect(() => {
        SetInitRequisitions();
    }, [requisitions]);

    useEffect(() => {
        const requisitionId = dataEdit ? requisitions.find(r => r.requisitionkey === dataEdit?.requisitionkey)?.billingrequisition_id : billingImages?.requisition_id;
        if (requisitions.length > 0)
            updateField(formId, 'requisition', { value: requisitionId, onlyText: Boolean(billingImages) });
        const debtorName = field.find(f => f.name === 'personName');
        if (debtorName) updateField(formId, 'personName', { value: billingImages?.deudor ?? "" });


    }, [dataEdit, requisitions, billingImages]);

    const computeLoadingFormInfo = (fields: FieldModel[]) => {

        const req = fields.find(f => f.name === 'requisition');
        const debtorName = fields.find(f => f.name === 'debtorName');
        const hasDebtor = Boolean(debtorName);
        const reqReady = Array.isArray(req?.options) && (req?.options?.length ?? 0) > 0;

        return !(reqReady && (debtorName?.value || !hasDebtor));
    };

    const loadingFormInfo = useMemo(() => computeLoadingFormInfo(field), [field]);

    return { requisitions, loadingFormInfo, submitRef, formReady, setFormReady, ResetForm }

}
export default useInitInvoicesForms;