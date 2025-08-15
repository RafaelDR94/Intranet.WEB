'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { shallow } from 'zustand/shallow';
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext';
import { useFormFieldsStore } from '@/app/stores/useFormFieldsStore/useFormFieldsStore';

import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore';
import { useProyectsStore } from '@/app/stores/useProyectsStore/useProyectsStore';
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore';

import type { FieldModel } from '@/app/components/DynamicForm/types';
import type { EmployeeType } from '@/app/mappings/employees/employee.types';
import type { Proyect } from '@/app/mappings/proyects/proyects.types';
import type { RequitionPost } from '@/app/mappings/requisitions/requisitions.types';
import {
  computeLoadingFormInfo,
  getOptionLabel,
  buildRequisitionPayload,
  createInitialFields
} from '../utilities/requisition';
import { SubmitFn } from '../../../requisitions/components/ExcelLoader/hooks/types';

/** Valores iniciales permitidos para el formulario de requisiciones. */
export type RequisitionInitialValues = {
  /** id de la requisición (obligatorio en edit) */
  id?: string;
  /** ids crudos para setear en selects/inputs */
  employeeId?: string | number;
  projectId?: string | number;
  requisitionKey?: string;
};

type Mode = 'create' | 'edit';
/**
 * Gestiona la lógica del formulario de requisiciones.
 * Carga catálogos, maneja envíos y expone helpers para el componente.
 *
 * @param mode indica si se crea o edita una requisición.
 * @param initialValues valores iniciales para modo edición.
 * @returns objeto con campos, manejadores y estado del formulario.
 */
export const useRequisitionForm = (
  mode: Mode,
  initialValues?: RequisitionInitialValues
) => {
  const formId = `requisitions-form-${mode}`;

  // Principal (spinner + alert)
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  // Submit externo (DynamicForm)
  const submitRef = useRef<SubmitFn | null>(null);
  const [formReady, setFormReady] = useState(false);

  // Form Fields (multi-instancia por formId)
  const fields = useFormFieldsStore((s) => s.fieldsByFormId[formId] ?? []);
  const { setFields, updateField, resetFields } = useFormFieldsStore.getState();

  // Employees (prefetch)
  const { employees, employeesError, fetchEmployees } = useEmployeesStore(
    (s) => ({
      employees: s.employees,
      employeesError: s.error,
      fetchEmployees: s.fetchEmployees,
    }),
    shallow
  );
  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  // Proyects (prefetch)
  const { proyects, proyectsError, fetchProyects } = useProyectsStore(
    (s) => ({
      proyects: s.proyects,
      proyectsError: s.error,
      fetchProyects: s.fetchProyects,
    }),
    shallow
  );
  useEffect(() => { fetchProyects(); }, [fetchProyects]);

  // Requisitions (create / update)
  const {
    createRequisition,
    updateRequisition,
    resetFlags,
    creating,
    updating,
    successPost,
    successPut,
    error,
  } = useRequisitionsStore((s) => ({
    createRequisition: s.createRequisition,
    updateRequisition: s.updateRequisition,
    resetFlags: s.resetFlags,
    creating: s.creating,
    updating: s.updating,
    successPost: s.successPost,
    successPut: s.successPut,
    error: s.error,
  }), shallow);

  // Error contextual
  const opRunning = mode === 'create' ? creating : updating;
  const opSuccess = mode === 'create' ? successPost : successPut;
  const opError = useMemo(
    () => (!opRunning && !opSuccess ? error : undefined),
    [opRunning, opSuccess, error]
  );

  // Monta iniciales y limpia
  useEffect(() => {
    const initialFields: FieldModel[] = createInitialFields();
    setFields(formId, initialFields);
    return () => {
      resetFields(formId);
      resetFlags();
    };
  }, [formId, setFields, resetFields, resetFlags]);
  

  // Popular opciones: empleados
  useEffect(() => {
    if (employees?.length) {
      updateField(formId, 'employees', {
        options: employees.map((e: EmployeeType) => ({
          label: e.fullname,
          value: e.employee_id,
        })),
      });
    }
  }, [employees, formId]);

  // Popular opciones: proyectos
  useEffect(() => {
    if (proyects?.length) {
      updateField(formId, 'project', {
        options: proyects.map((p: Proyect) => ({
          label: p.proyectKey,
          value: p.id,
        })),
      });
    }
  }, [proyects, formId]);

  // Setear valores iniciales cuando existan (modo edit)
  useEffect(() => {
    if (!initialValues) return;

    // Ajusta aquí los names exactos de tus fields (employees, project, requisitionKey)
    if (initialValues.employeeId !== undefined) {
      updateField(formId, 'employees', { value: initialValues.employeeId });
    }
    if (initialValues.projectId !== undefined) {
      updateField(formId, 'project', { value: initialValues.projectId });
    }
    if (initialValues.requisitionKey !== undefined) {
      updateField(formId, 'requisitionkey', { value: initialValues.requisitionKey,onlyText:true });
    }
  }, [initialValues, formId]);

  // Loading de catálogos
  const loadingFormInfo = useMemo(() => computeLoadingFormInfo(fields), [fields]);

  // Errores de catálogos
  useEffect(() => {
    if (!employeesError) return;
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudo cargar la lista de empleados',
      description: String(employeesError) ?? 'Intenta refrescar.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: 'Refrescar',
      onSecondaryClick: () => { hideAlert(); fetchEmployees(); },
    });
  }, [employeesError, fetchEmployees, hideAlert, showAlert]);

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
  }, [proyectsError, fetchProyects, hideAlert, showAlert]);

  // Spinner + alert según operación (create/update)
  useEffect(() => {
    if (opRunning) {
      showSpinner({ message: 'Espera un momento, tu información se está guardando' });
      return;
    }
    hideSpinner();

    if (opSuccess) {
      showAlert({
        type: 'success',
        variant: 'filled',
        title: mode === 'create' ? 'Requisición creada' : 'Requisición actualizada',
        description: mode === 'create'
          ? 'Se registró la requisición.'
          : 'Se actualizó la requisición.',
        showPrimaryButton: true,
        primaryLabel: 'Cerrar',
        onPrimaryClick: () => { hideAlert(); resetFlags(); },
      });
    }

    if (opError) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: mode === 'create'
          ? 'No se pudo crear la requisición'
          : 'No se pudo actualizar la requisición',
        description: String(opError) ?? 'Ocurrió un error. Intenta de nuevo.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: () => { hideAlert(); resetFlags(); },
        showSecondaryButton: true,
        secondaryLabel: 'Reintentar',
        onSecondaryClick: () => { hideAlert(); submitRef.current?.(); },
      });
    }
  }, [opRunning, opSuccess, opError, mode, showSpinner, hideSpinner, showAlert, hideAlert, resetFlags]);

  // Submit (para DynamicForm) -> decide create o update
  const handleSubmit = useCallback(async (values: Record<string, any>) => {
    const payload: RequitionPost = buildRequisitionPayload({
      values,
      employees,
      proyects,
      fields,
      getOptionLabel: (fieldName: string, value: unknown) =>
        getOptionLabel(fields, fieldName, value),
    });

    if (mode === 'edit' && initialValues?.id) {
      await updateRequisition({ ...payload, billingrequisition_id: initialValues.id });
      return;
    }
    await createRequisition(payload);
  }, [mode, initialValues, fields, employees, proyects, createRequisition, updateRequisition]);

  return {
    // para el componente
    fields,
    loadingFormInfo,
    formReady,
    setFormReady,
    submitRef,
    handleSubmit,
    onSubmit: () => submitRef.current?.(),
    buttonDisabled: !formReady,
  };
};
