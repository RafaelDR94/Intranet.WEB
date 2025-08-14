'use client'
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    ReactNode
} from 'react'

import { shallow } from 'zustand/shallow';
import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'
import { useFormFieldsStore } from '@/app/stores/useFormFieldsStore/useFormFieldsStore'
import useAlert from '@/app/context/PrincipalContext/hooks/useAlert/useAlert';
import { Proyect } from '@/app/mappings/proyects/proyects.types';
import { Requisition } from '@/app/mappings/requisitions/requisitions.types';
import { FieldModel } from '@/app/components/DynamicForm/types';
export interface InvoicesContextType {
    proyects: Proyect[];
    requisitions: Requisition[];
    field1: FieldModel[];
    field2: FieldModel[];
    formId1: string;
    formId2: string;
    setFields: (formId: string, newFields: FieldModel[]) => void;
    updateField: (formId: string, name: string, changes: Partial<FieldModel>) => void;
    resetFields: (formId: string) => void;
}

// 2️⃣ Valor inicial por defecto
const initialValue: InvoicesContextType = {
    proyects: [],
    requisitions: [],
    field1: [],
    field2: [],
    formId1: "invoices-form",
    formId2: "ticket-form",
    setFields: (formId: string, newFields: FieldModel[]) => { },
    updateField: (formId: string, name: string, changes: Partial<FieldModel>) => { },
    resetFields: (formId: string) => { },
}

// 3️⃣ Crear contexto
const InvoicesContext = createContext<InvoicesContextType>(initialValue)

// 4️⃣ Provider
export const InvoicesProvider = ({ children }: { children: ReactNode }) => {
    const formId1 = "invoices-form";
    const formId2 = "ticket-form";
    const { showAlert, hideAlert } = useAlert();
    const { proyects, proyectsError, fetchProyects } = useProyectsStore(
        (s) => ({
            proyects: s.proyects,
            proyectsError: s.error,
            fetchProyects: s.fetchProyects,
        }),
        shallow
    );
    const { requisitions, requisitionsError, fetchRequisitions } = useRequisitionsStore(
        (s) => ({
            requisitions: s.requisitions,
            requisitionsError: s.error,
            fetchRequisitions: s.fetchRequisitions,
        }),
        shallow
    );

    const { setFields, updateField, resetFields } = useFormFieldsStore.getState();

    const field1 = useFormFieldsStore((s) => s.fieldsByFormId[formId1] ?? []);
    const field2 = useFormFieldsStore((s) => s.fieldsByFormId[formId2] ?? []);
    useEffect(() => {
        fetchProyects();
        fetchRequisitions();
    }, [])

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
            onSecondaryClick: () => { hideAlert(); fetchRequisitions(); },
        });
    }, [requisitionsError]);

    useEffect(() => {
        if (!proyectsError) return;
        showAlert({
            type: 'error',
            variant: 'filled',
            title: 'No se pudo cargar la lista de proyectos',
            description: String(proyectsError) ?? 'Intenta refrescar.',
            showPrimaryButton: true,
            primaryLabel: 'Entendido',
            onPrimaryClick: hideAlert,
            showSecondaryButton: true,
            secondaryLabel: 'Refrescar',
            onSecondaryClick: () => { hideAlert(); fetchProyects(); },
        });
    }, [proyectsError]);

    // 🧠 Memoizar el value para evitar renders innecesarios
    const value = useMemo(
        () => ({
            proyects,
            requisitions,
            field1,
            field2,
            formId1,
            formId2,
            setFields,
            updateField,
            resetFields,
        }),
        [proyects,
            requisitions,
            field1,
            field2,
            formId1,
            formId2,] // solo cambia cuando invoices cambie
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
