'use client'
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    ReactNode
} from 'react'

import { shallow } from 'zustand/shallow';
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'
import { useFormFieldsStore } from '@/app/stores/useFormFieldsStore/useFormFieldsStore'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { Requisition } from '@/app/mappings/requisitions/requisitions.types';
import { FieldModel } from '@/app/components/DynamicForm/types';
import { useAuth } from '@/app/context/AuthContext/AuthContext';
import { User } from '@/app/context/AuthContext/types';
export interface InvoicesContextType {

    requisitions: Requisition[];
    field1: FieldModel[];
    field2: FieldModel[];
    formId1: string;
    formId2: string;
    setFields: (formId: string, newFields: FieldModel[]) => void;
    updateField: (formId: string, name: string, changes: Partial<FieldModel>) => void;
    resetFields: (formId: string) => void;
    user: User | null
}

// 2️⃣ Valor inicial por defecto
const initialValue: InvoicesContextType = {
    
    requisitions: [],
    field1: [],
    field2: [],
    formId1: "invoices-form",
    formId2: "ticket-form",
    setFields: (formId: string, newFields: FieldModel[]) => { },
    updateField: (formId: string, name: string, changes: Partial<FieldModel>) => { },
    resetFields: (formId: string) => { },
    user: null
}

// 3️⃣ Crear contexto
const InvoicesContext = createContext<InvoicesContextType>(initialValue)

// 4️⃣ Provider
export const InvoicesProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const formId1 = "invoices-form";
    const formId2 = "ticket-form";
    const { usePrincipalAlert } = usePrincipal();
    const { showAlert, hideAlert } = usePrincipalAlert;


    const { requisitions, requisitionsError, warning, fetchRequisitionsByIdEmployee, resetFlags } = useRequisitionsStore(
        (s) => ({
            requisitions: s.requisitions,
            requisitionsError: s.error,
            warning: s.warning,
            fetchRequisitionsByIdEmployee: s.fetchRequisitionsByIdEmployee,
            resetFlags: s.resetFlags,
            reset: s.reset
        }),
        shallow
    );

    const { setFields, updateField, resetFields } = useFormFieldsStore.getState();

    const EMPTY_ARRAY: FieldModel[] = [];



    const f1 = useFormFieldsStore((s) => s.fieldsByFormId[formId1]); // <- sin ?? []
    const f2 = useFormFieldsStore((s) => s.fieldsByFormId[formId2]); // <- sin ?? []

    const field1 = f1 ?? EMPTY_ARRAY; // coalesce fuera del selector
    const field2 = f2 ?? EMPTY_ARRAY;

    useEffect(() => {
        if (user) fetchRequisitionsByIdEmployee(user.idEmployee, true);
    }, [user])

    useEffect(() => {
        if (!requisitionsError) return;
        showAlert({
            type: 'error',
            variant: 'filled',
            title: 'No se pudo cargar la lista de empleados',
            description: String(requisitionsError) ?? 'Intenta refrescar.',
            showPrimaryButton: true,
            primaryLabel: 'Entendido',
            onPrimaryClick: hideAlert,
            showSecondaryButton: true,
            secondaryLabel: 'Refrescar',
            onSecondaryClick: () => { hideAlert(); if (user) fetchRequisitionsByIdEmployee(user?.idEmployee, true); },
        });
        resetFlags();
    }, [requisitionsError]);
    useEffect(() => {
        if (!warning) return;
        showAlert({
            type: 'warning',
            variant: 'filled',
            title: 'Sin requisiciones',
            description: warning ?? 'Intenta refrescar.',
            showPrimaryButton: true,
            primaryLabel: 'Entendido',
            onPrimaryClick: hideAlert,
            showSecondaryButton: true,
            secondaryLabel: 'Refrescar',
            onSecondaryClick: () => { hideAlert(); if (user) fetchRequisitionsByIdEmployee(user?.idEmployee, true); },
        });
        resetFlags();
    }, [warning]);


    // 🧠 Memoizar el value para evitar renders innecesarios
    const value = useMemo(
        () => ({
       
            requisitions,
            field1,
            field2,
            formId1,
            formId2,
            setFields,
            updateField,
            resetFields,
            user
        }),
        [
            requisitions,
            field1,
            field2,
            formId1,
            formId2,
            user
        ] // solo cambia cuando invoices cambie
    )

    return (
        <InvoicesContext.Provider value={value}>
            {children}
        </InvoicesContext.Provider>
    )
}

// 5️⃣ Hook para consumir el contexto
export const useInvoices = () => {
    const context = useContext(InvoicesContext)
    if (!context) {
        throw new Error('useInvoices debe usarse dentro de un InvoicesProvider')
    }
    return context
}
