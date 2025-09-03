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
import { useAuth } from '@/app/context/AuthContext/AuthContext';
import { Requisition } from '@/app/mappings/requisitions/requisitions.types';
// /** Valores iniciales permitidos para el formulario de requisiciones. */
// export type RequisitionInitialValues = {
//   /** id de la requisición (obligatorio en edit) */
//   id?: string;
//   /** ids crudos para setear en selects/inputs */
//   employeeId?: string | number;
//   projectId?: string | number;
//   requisitionKey?: string;
// };

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
  initialValues?: Requisition,
  startDisabled?: boolean
) => {
  const formId = `requisitions-form-${mode}`;
  const { currentPagePermissions } = useAuth();
  // Principal (spinner + alert)
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  // Submit externo (DynamicForm)
  const submitRef = useRef<SubmitFn | null>(null);
  const [formReady, setFormReady] = useState(false);
  const [disableForm, setDisableForm] = useState(startDisabled);

  // Form Fields (multi-instancia por formId)
  const emptyRef = useRef<FieldModel[]>([]);
  const fields = useFormFieldsStore((s) => s.fieldsByFormId[formId] ?? emptyRef.current);
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
  useEffect(() => { fetchProyects(); }, []);

  const ResetForm = () => {
    resetFields(formId);
    setTimeout(() => {
      const initialFields: FieldModel[] = createInitialFields();
      setFields(formId, initialFields);
      setTimeout(() => {
        UpdateProyects();
        UpdateEmployees();
      }
        , 250)
    }, 500)
  }
  // useEffect(() => {
  //   if (disableForm) ResetForm();
  // }, [disableForm])

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

  /// Error contextual
  const opRunning = mode === 'create' ? creating : updating;
  const opSuccess = mode === 'create' ? successPost : successPut;
  const opError = useMemo(
    () => (!opRunning && !opSuccess ? error : undefined),
    [opRunning, opSuccess, error]
  );

  const UpdateEmployees = () => {
    if (employees?.length) {
      updateField(formId, 'employees', {
        options: employees.map((e: EmployeeType) => ({
          label: e.fullname,
          value: e.employee_id,
        })),
        value: ""
      });
    }
  }

  const UpdateProyects = () => {
    if (proyects?.length) {
      updateField(formId, 'project', {
        options: proyects.map((p: Proyect) => ({
          label: p.proyectKey,
          value: p.id,
        })),
        value: ""
      });
    }
  }

  // Monta iniciales y limpia
  useEffect(() => {
    const initialFields: FieldModel[] = createInitialFields();
    setFields(formId, initialFields);
    return () => {
      resetFields(formId);
      resetFlags();
    };
  }, [formId]);


  // Popular opciones: empleados
  useEffect(() => {
    UpdateEmployees();
  }, [employees, formId]);

  // Popular opciones: proyectos
  useEffect(() => {
    UpdateProyects();
  }, [proyects, formId]);

  // Setear valores iniciales cuando existan (modo edit)
  const loadingFormInfo = useMemo(() => computeLoadingFormInfo(fields), [fields]);
  useEffect(() => {
    console.log("initialValues", initialValues);
    if (!initialValues || loadingFormInfo) return;
    // Ajusta aquí los names exactos de tus fields (employees, project, requisitionKey)
    if (initialValues.id_Employee !== undefined) {
      updateField(formId, 'employees', { value: initialValues.id_Employee });
    }
    if (initialValues.idProject !== undefined) {
      updateField(formId, 'project', { value: initialValues.idProject });
    }
    if (initialValues.requisitionkey !== undefined) {
      updateField(formId, 'requisitionkey', { value: initialValues.requisitionkey });
    }
    if (initialValues.assignmentdate !== undefined) {
      updateField(formId, 'asignamentdate', { value: initialValues.assignmentdate });
    }
    if (initialValues.endDate !== undefined) {
      updateField(formId, 'cxpdate', { value: initialValues.endDate });
    }
    if (initialValues.amountdeposited !== undefined) {
      updateField(formId, 'depositamount', { value: Number(initialValues.amountdeposited) });
    }
    if (initialValues.amountdeposited !== undefined) {
      updateField(formId, 'state', { value: initialValues.state });
    }
    if (initialValues.motive !== undefined) {
      updateField(formId, 'motive', { value: initialValues.motive });
    }
  }, [initialValues, formId, loadingFormInfo]);

  // Loading de catálogos


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
      ResetForm();
      showAlert({
        type: 'success',
        variant: 'filled',
        title: mode === 'create' ? 'Requisición creada' : 'Requisición actualizada',
        description: mode === 'create'
          ? 'Se registró la requisición.'
          : 'Se actualizó la requisición.',
        autoCloseMs: 1500,
        showPrimaryButton: false,
        showSecondaryButton: false,
        onClose: () => { resetFlags(); },
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

    if (mode === 'edit' && initialValues?.billingrequisition_id) {
      await updateRequisition({ ...payload, billingrequisition_id: initialValues.billingrequisition_id });
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
    currentPagePermissions,
    disableForm,
    setDisableForm
  };
};
