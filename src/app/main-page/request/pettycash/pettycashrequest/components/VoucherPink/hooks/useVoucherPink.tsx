"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { shallow } from "zustand/shallow";

import { SubmitFn } from "@/app/main-page/accounting/requisitions/requisitions/components/ExcelLoader/hooks/types";

import {
  computeLoadingFormInfo,
  buildPettyCashVoucherPayload,
  getOptionLabel,
  createInitialFields,
} from "../utilities/voucherPink";

import type { FieldModel } from "@/app/components/DynamicForm/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { Proyect } from "@/app/mappings/proyects/proyects.types";
import type { PostPettyCashVoucher } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import { useBillingPettyCash } from "@/app/stores/useBillingPettyCash/useBillingPettyCash";
import { UseVoucherFormProps, UseVoucherFormReturn } from "./types";
/**
 * Gestiona la lógica del formulario de vales de caja chica.
 * Carga catálogos, maneja envíos y expone helpers para el componente.
 *
 * @param params opciones del formulario de vale de caja chica.
 * @returns objeto con campos, manejadores y estado del formulario.
 */
export const useVoucherPink = ({
  mode,
  initialValues,
  startDisabled,
}: UseVoucherFormProps): UseVoucherFormReturn => {
  const formId = `petty-cash-voucher-form-${mode}`;
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
  const fields = useFormFieldsStore(
    (s) => s.fieldsByFormId[formId] ?? emptyRef.current,
  );
  const { setFields, updateField, resetFields } = useFormFieldsStore.getState();

  // Employees (prefetch)
  const { employees, employeesError, fetchEmployees } = useEmployeesStore(
    (s) => ({
      employees: s.employees,
      employeesError: s.error,
      fetchEmployees: s.fetchEmployees,
    }),
    shallow,
  );
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Proyects (prefetch)
  const { proyects, proyectsError, fetchProyects } = useProyectsStore(
    (s) => ({
      proyects: s.proyects,
      proyectsError: s.error,
      fetchProyects: s.fetchProyects,
    }),
    shallow,
  );
  useEffect(() => {
    fetchProyects();
  }, [fetchProyects]);

  const ResetForm = useCallback(() => {
    resetFields(formId);
    setTimeout(() => {
      const initialFields: FieldModel[] = createInitialFields();
      setFields(formId, initialFields);
      setTimeout(() => {
        UpdateProyects();
        // UpdateEmployees();
      }, 250);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId, resetFields, setFields]);

  const {
    createPettyCashVoucher,
    updatePettyCashVoucher,
    resetFlags,
    fetchPettyCashFunds,
    pettyCashFunds,
    creating,
    updating,
    successPostVoucher,
    successPutVoucher,
    error,
  } = useBillingPettyCash(
    (s) => ({
      createPettyCashVoucher: s.createPettyCashVoucher,
      updatePettyCashVoucher: s.updatePettyCashVoucher,
      resetFlags: s.resetFlags,
      fetchPettyCashFunds: s.fetchPettyCashFunds,
      pettyCashFunds: s.pettyCashFunds,
      creating: s.creating,
      updating: s.updating,
      successPostVoucher: s.successPostVoucher,
      successPutVoucher: s.successPutVoucher,
      error: s.error,
    }),
    shallow,
  );

  useEffect(() => {
    fetchPettyCashFunds();
  }, [fetchPettyCashFunds]);

  /// Error contextual
  const opRunning = mode === "create" ? creating : updating;
  const opSuccess = mode === "create" ? successPostVoucher : successPutVoucher;
  const opError = useMemo(
    () => (!opRunning && !opSuccess ? error : undefined),
    [opRunning, opSuccess, error],
  );

  // const UpdateEmployees = useCallback(() => {
  //   if (employees?.length) {
  //     updateField(formId, "employees", {
  //       options: employees.map((e: EmployeeType) => ({
  //         label: e.fullname,
  //         value: e.employee_id,
  //       })),
  //       value: "",
  //     });
  //   }
  // }, [employees, formId, updateField]);

  const UpdateProyects = useCallback(() => {
    if (proyects?.length) {
      updateField(formId, "project", {
        options: proyects.map((p: Proyect) => ({
          label: p.proyectKey,
          value: p.id,
        })),
        value: "",
      });
    }
  }, [proyects, formId, updateField]);

  // Monta iniciales y limpia
  useEffect(() => {
    const initialFields: FieldModel[] = createInitialFields();
    setFields(formId, initialFields);
    return () => {
      resetFields(formId);
      resetFlags();
    };
  }, [formId, resetFields, resetFlags, setFields]);

  // Popular opciones: empleados
  // useEffect(() => {
  //   UpdateEmployees();
  // }, [employees, formId, UpdateEmployees]);

  // Popular opciones: proyectos
  useEffect(() => {
    UpdateProyects();
  }, [proyects, formId, UpdateProyects]);

  // Setear valores iniciales cuando existan (modo edit)
  const loadingFormInfo = useMemo(
    () => computeLoadingFormInfo(fields),
    [fields],
  );
  useEffect(() => {
    if (!initialValues || loadingFormInfo) return;
    if (initialValues.employee_id !== undefined) {
      updateField(formId, "employees", { value: initialValues.employee_id });
    }
    if (initialValues.project_id !== undefined) {
      updateField(formId, "project", { value: initialValues.project_id });
    }
    if (initialValues.application_date !== undefined) {
      updateField(formId, "asignamentdate", {
        value: initialValues.application_date,
      });
    }
    if (initialValues.amount !== undefined) {
      updateField(formId, "monto", {
        value: Number(initialValues.amount),
      });
    }
    if (initialValues.concept !== undefined) {
      updateField(formId, "concept", { value: initialValues.concept });
    }
  }, [initialValues, formId, loadingFormInfo, updateField]);

  // Loading de catálogos

  // Errores de catálogos
  useEffect(() => {
    if (!employeesError) return;
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se pudo cargar la lista de empleados",
      description: String(employeesError) || "Intenta refrescar.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: "Refrescar",
      onSecondaryClick: () => {
        hideAlert();
        fetchEmployees();
      },
    });
  }, [employeesError, fetchEmployees, hideAlert, showAlert]);

  useEffect(() => {
    if (!proyectsError) return;
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se pudo cargar la lista de proyectos",
      description: String(proyectsError) || "Intenta refrescar.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: "Refrescar",
      onSecondaryClick: () => {
        hideAlert();
        fetchProyects();
      },
    });
  }, [proyectsError, fetchProyects, hideAlert, showAlert]);

  // Spinner + alert según operación (create/update)
  useEffect(() => {
    if (opRunning) {
      showSpinner({
        message: "Espera un momento, tu información se está guardando",
      });
      return;
    }
    hideSpinner();

    if (opSuccess) {
      ResetForm();
      showAlert({
        type: "success",
        variant: "filled",
        title:
          mode === "create" ? "Vale creado" : "Vale actualizado",
        description:
          mode === "create"
            ? "Se registró el vale de caja chica."
            : "Se actualizó el vale de caja chica.",
        autoCloseMs: 1500,
        showPrimaryButton: false,
        showSecondaryButton: false,
        onClose: () => {
          resetFlags();
        },
      });
    }

    if (opError) {
      showAlert({
        type: "error",
        variant: "filled",
        title:
          mode === "create"
            ? "No se pudo crear el vale"
            : "No se pudo actualizar el vale",
        description: String(opError) || "Ocurrió un error. Intenta de nuevo.",
        showPrimaryButton: true,
        primaryLabel: "Entendido",
        onPrimaryClick: () => {
          hideAlert();
          resetFlags();
        },
        showSecondaryButton: true,
        secondaryLabel: "Reintentar",
        onSecondaryClick: () => {
          hideAlert();
          submitRef.current?.();
        },
      });
    }
  }, [
    opRunning,
    opSuccess,
    opError,
    mode,
    showSpinner,
    hideSpinner,
    showAlert,
    hideAlert,
    resetFlags,
    ResetForm,
  ]);

  // Submit (para DynamicForm) -> decide create o update
  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      const payload: PostPettyCashVoucher = buildPettyCashVoucherPayload({
        values,
        employees,
        proyects,
        fields,
        pettyCashFundId: pettyCashFunds?.[0]?.id,
        getOptionLabel: (fieldName: string, value: unknown) =>
          getOptionLabel(fields, fieldName, value),
      });

      if (mode === "edit" && initialValues?.id) {
        await updatePettyCashVoucher({ ...payload, id: initialValues.id });
        return;
      }
      await createPettyCashVoucher(payload);
    },
    [
      mode,
      initialValues,
      fields,
      employees,
      proyects,
      pettyCashFunds,
      createPettyCashVoucher,
      updatePettyCashVoucher,
    ],
  );

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
    setDisableForm,
  };
};
