"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { shallow } from "zustand/shallow";

import { SubmitFn } from "@/app/main-page/accounting/requisitions/requisitions/components/ExcelLoader/hooks/types";

import {
  computeLoadingFormInfo,
  buildPettyCashVoucherPayload,
  getOptionLabel,
  createInitialFields,
} from "../utilities/voucherBlue";

import type { FieldModel } from "@/app/components/DynamicForm/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import type { Proyect } from "@/app/mappings/proyects/proyects.types";
import type { PostPettyCashVoucher } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import { useBillingPettyCash } from "@/app/stores/useBillingPettyCash/useBillingPettyCash";
import { UseVoucherFormProps, UseVoucherFormReturn } from "./types";

/**
 * Gestiona la lógica del formulario de vales azules de caja chica.
 * Carga catálogos, maneja envíos y expone helpers para el componente.
 */
export const useVoucherBlue = ({
  mode,
  dataEdit,
  startDisabled,
}: UseVoucherFormProps): UseVoucherFormReturn => {
  const formId = `petty-cash-voucher-blue-form-${mode}`;
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
    if (!dataEdit || loadingFormInfo) return;
    if (dataEdit.project_id !== undefined) {
      updateField(formId, "project", { value: dataEdit.project_id });
    }
    if (dataEdit.application_date !== undefined) {
      updateField(formId, "asignamentdate", {
        value: dataEdit.application_date,
      });
    }
    if (dataEdit.amount !== undefined) {
      updateField(formId, "monto", {
        value: Number(dataEdit.amount),
      });
    }
    if (dataEdit.concept !== undefined) {
      updateField(formId, "concept", { value: dataEdit.concept });
    }
  }, [dataEdit, formId, loadingFormInfo, updateField]);

  // Loading de catálogos

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
        title: mode === "create" ? "Envio Exitoso" : "Actualizado Exitoso",
        description:
          mode === "create"
            ? "Tu vale se ha enviado exitosamente."
            : "Tu vale se actualizó exitosamente.",
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
        proyects,
        fields,
        pettyCashFundId: pettyCashFunds?.[0]?.id,
        getOptionLabel: (fieldName: string, value: unknown) =>
          getOptionLabel(fields, fieldName, value),
      });

      if (mode === "edit" && dataEdit?.id) {
        await updatePettyCashVoucher({ ...payload, id: dataEdit.id });
        return;
      }
      await createPettyCashVoucher(payload);
    },
    [
      mode,
      dataEdit,
      fields,
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
