import { useMemo, useEffect, useRef, useState } from "react";

import { useInvoices } from "../context/InvoicesContext";


import { InitInvoicesForms } from "./types";

import { FieldModel } from "@/app/components/DynamicForm/types";
import { BillingDocumentCategory, BillingDocumentDescription } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { Requisition } from "@/app/mappings/requisitions/requisitions.types";




const useInitInvoicesForms = ({ initialformFields, field, formId, dataEdit, billingImages }: InitInvoicesForms) => {
    const { user, requisitions, billingDocumentDescription, billingCategories, setFields, updateField, resetFields } = useInvoices();
    const submitRef = useRef<() => void | Promise<void>>(null)
    const [formReady, setFormReady] = useState(false)
    const fieldsReady = field.length > 0;

    const ResetForm = () => {
        const initialFields: FieldModel[] = initialformFields;
        setFields(formId, initialFields);
        setTimeout(() => {
            setUser();
            SetInitRequisitions();
            SetDescriptions();
            SetCategories();
        }, 500)

    }
    const setUser = () => {
        if (user && fieldsReady) {
            updateField(formId, 'debtorName', { value: user.fullName });
        }
    }
    const SetDescriptions = () => {
        if (billingDocumentDescription) updateField(formId, 'description', {
            options: billingDocumentDescription.map((r: BillingDocumentDescription) => ({
                label: r.name,
                value: r.id_billingdescription,
            })),

        });
    }
    const SetCategories = () => {
        if (billingCategories) updateField(formId, 'category', {
            options: billingCategories.map((r: BillingDocumentCategory) => ({
                label: r.name,
                value: r.id_billingcategory,
            })),

        });
    }
    const SetInitRequisitions = () => {
        updateField(formId, 'requisition', {
            options: requisitions.map((r: Requisition) => ({
                label: r.requisitionkey + " - " + r.projectname,
                value: r.billingrequisition_id,
            })),

            onChange: (value) => {
                const employeeName = requisitions.find(r => r.billingrequisition_id === value)?.employeename
                const proyect = requisitions.find(r => r.billingrequisition_id === value)?.projectname
                const debtorName = field.find(f => f.name === 'personName');
                updateField(formId, 'proyect', { value: proyect });
                updateField(formId, 'requisition', { value: value });
                if (debtorName) {
                    updateField(formId, 'personName', { value: employeeName });
                }
            },
        });
    }

    useEffect(() => {
        setUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.fullName, fieldsReady, formId]);

    useEffect(() => {
        const initialFields: FieldModel[] = initialformFields;
        setFields(formId, initialFields);
        return () => {
            resetFields(formId);
            SetInitRequisitions();

        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formId]);




    useEffect(() => {
        SetInitRequisitions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requisitions]);


    useEffect(() => {
        SetDescriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [billingDocumentDescription])
    useEffect(() => {
        SetCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [billingCategories])


    useEffect(() => {
        const requisitionId = dataEdit ? requisitions.find(r => r.requisitionkey === dataEdit?.requisitionkey)?.billingrequisition_id : billingImages?.requisition_id;
        const categoryId = dataEdit ? dataEdit.category.id_billingcategory : billingImages?.category?.id_billingcategory
        const descriptionId = dataEdit ? dataEdit.description.id_billingdescription : billingImages?.description?.id_billingdescription
        if (requisitions.length > 0)
            updateField(formId, 'requisition', { value: requisitionId, onlyText: Boolean(billingImages) });
        if (billingCategories.length > 0)
            updateField(formId, 'category', { value: categoryId, onlyText: Boolean(billingImages) });
        if (billingDocumentDescription.length > 0)
            updateField(formId, 'description', { value: descriptionId, onlyText: Boolean(billingImages) });
        if (billingImages?.proyect)
            updateField(formId, 'proyect', { value: billingImages?.proyect, onlyText: Boolean(billingImages) });
        if (billingImages?.numnights)
            updateField(formId, 'numnights', { value: billingImages?.numnights, onlyText: Boolean(billingImages), label: "No. Noches" });
        if (billingImages?.numpersons)
            updateField(formId, 'numpersons', { value: billingImages?.numpersons, onlyText: Boolean(billingImages), label: "No. Personas" });
        const debtorName = field.find(f => f.name === 'personName');
        if (debtorName) updateField(formId, 'personName', { value: billingImages?.deudor ?? "" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataEdit, requisitions, billingImages, billingCategories, billingDocumentDescription]);

    const computeLoadingFormInfo = (fields: FieldModel[]) => {

        const req = fields.find(f => f.name === 'requisition');
        const description = fields.find(f => f.name === 'description');
        const category = fields.find(f => f.name === 'category');
        const debtorName = fields.find(f => f.name === 'debtorName');
        const hasDebtor = Boolean(debtorName);
        const reqReady = Array.isArray(req?.options) && (req?.options?.length ?? 0) > 0;
        const descReady = Array.isArray(description?.options) && (description?.options?.length ?? 0) > 0;
        const catReady = Array.isArray(category?.options) && (category?.options?.length ?? 0) > 0;
        return !(reqReady && descReady && catReady && (debtorName?.value || !hasDebtor));
    };

    const loadingFormInfo = useMemo(() => computeLoadingFormInfo(field), [field]);

    return { requisitions, loadingFormInfo, submitRef, formReady, setFormReady, ResetForm, updateField }

}
export default useInitInvoicesForms;  
