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
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
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
  const isEdit = mode === "edit";
  const { currentPagePermissions, user } = useAuth();
  const { firebasestorage } = useFirebase();
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

  const UpdateProyects = useCallback(() => {
    if (proyects?.length) {
      updateField(formId, "project", {
        options: proyects.map((p: Proyect) => ({
          label: p.proyectKey,
          value: p.id,
        })),
        value: dataEdit?.project_id ?? "",
      });
    }
  }, [proyects, formId, updateField, dataEdit]);

  const ResetForm = useCallback(() => {
    resetFields(formId);
    setTimeout(() => {
      const initialFields: FieldModel[] = createInitialFields();
      setFields(formId, initialFields);
      setTimeout(() => {
        UpdateProyects();
      }, 250);
    }, 500);
  }, [formId, resetFields, setFields, UpdateProyects]);

  const {
    createPettyCashVoucher,
    updatePettyCashVoucher,
    resetFlags,
    fetchPettyCashFunds,
    pettyCashFunds,
  } = useBillingPettyCash(
    (s) => ({
      createPettyCashVoucher: s.createPettyCashVoucher,
      updatePettyCashVoucher: s.updatePettyCashVoucher,
      resetFlags: s.resetFlags,
      fetchPettyCashFunds: s.fetchPettyCashFunds,
      pettyCashFunds: s.pettyCashFunds,
    }),
    shallow,
  );

  useEffect(() => {
    fetchPettyCashFunds();
  }, [fetchPettyCashFunds]);

  const [opRunning, setOpRunning] = useState(false);
  const [opSuccess, setOpSuccess] = useState(false);
  const [opError, setOpError] = useState<string | undefined>();

  // Monta iniciales y limpia
  useEffect(() => {
    const initialFields: FieldModel[] = createInitialFields(dataEdit);
    setFields(formId, initialFields);
    return () => {
      resetFields(formId);
      resetFlags();
    };
  }, [formId, resetFields, resetFlags, setFields, dataEdit]);

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
    if (dataEdit.xml) {
      updateField(formId, "xml", {
        value: { name: dataEdit.xml, url: dataEdit.xml },
        initialFile: { name: dataEdit.xml, url: dataEdit.xml },
      });
    }
    if (dataEdit.pdf) {
      updateField(formId, "pdf", {
        value: { name: dataEdit.pdf, url: dataEdit.pdf },
        initialFile: { name: dataEdit.pdf, url: dataEdit.pdf },
      });
    }
  }, [dataEdit, formId, loadingFormInfo, updateField]);

  useEffect(() => {
    if (user?.fullName) {
      updateField(formId, "personName", { value: user.fullName });
    }
  }, [user?.fullName, formId, updateField]);

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

  useEffect(() => {
    if (opRunning) {
      showSpinner({
        message: "Espera un momento, tu información se está guardando",
      });
      return;
    }
    hideSpinner();
  }, [opRunning, showSpinner, hideSpinner]);

  useEffect(() => {
    if (!opSuccess) return;
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
        setOpSuccess(false);
      },
    });
  }, [opSuccess, ResetForm, showAlert, mode, resetFlags]);

  useEffect(() => {
    if (!opError) return;
    showAlert({
      type: "error",
      variant: "filled",
      title:
        mode === "create"
          ? "No se pudo crear el vale"
          : "No se pudo actualizar el vale",
      description: opError || "Ocurrió un error. Intenta de nuevo.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: () => {
        hideAlert();
        resetFlags();
        setOpError(undefined);
      },
      showSecondaryButton: true,
      secondaryLabel: "Reintentar",
      onSecondaryClick: () => {
        hideAlert();
        submitRef.current?.();
      },
    });
  }, [opError, mode, showAlert, hideAlert, resetFlags]);

  const uploadXmlIfNeeded = async (file: any): Promise<string> => {
    const maybeFile = file instanceof File ? file : null;
    if (maybeFile) {
      const unique = `${user?.idEmployee}-${Date.now()}`;
      const url = await firebasestorage.uploadFile(
        maybeFile,
        `Billings/PettyCashVouchers/${unique}.xml`,
      );
      if (!url) throw new Error("Hubo un problema al subir el XML");
      return url;
    }
    if (isEdit && dataEdit?.xml) return dataEdit.xml;
    const urlObj = (file as { url?: string })?.url;
    if (urlObj) return urlObj;
    throw new Error("No se encontró XML válido para continuar");
  };

  const uploadPdfIfNeeded = async (file: any): Promise<string> => {
    const maybeFile = file instanceof File ? file : null;
    if (maybeFile) {
      const unique = `${user?.idEmployee}-${Date.now()}`;
      const url = await firebasestorage.uploadFile(
        maybeFile,
        `Billings/PettyCashVouchers/${unique}.pdf`,
      );
      if (!url) throw new Error("Hubo un problema al subir el PDF");
      return url;
    }
    if (isEdit && dataEdit?.pdf) return dataEdit.pdf;
    const urlObj = (file as { url?: string })?.url;
    if (urlObj) return urlObj;
    throw new Error("No se encontró PDF válido para continuar");
  };

  // Submit (para DynamicForm) -> decide create o update
  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      setOpRunning(true);
      try {
        const xmlUrl = await uploadXmlIfNeeded(values.xml);
        const pdfUrl = await uploadPdfIfNeeded(values.pdf);

        const payload: PostPettyCashVoucher = buildPettyCashVoucherPayload({
          values: { ...values, xml: { url: xmlUrl }, pdf: { url: pdfUrl } },
          proyects,
          fields,
          pettyCashFundId: pettyCashFunds?.[0]?.id,
          getOptionLabel: (fieldName: string, value: unknown) =>
            getOptionLabel(fields, fieldName, value),
          employeeId: user?.idEmployee ?? "",
        });

        const res =
          mode === "edit" && dataEdit?.id
            ? await updatePettyCashVoucher({ ...payload, id: dataEdit.id })
            : await createPettyCashVoucher(payload);

        setOpRunning(false);
        if (res) {
          setOpSuccess(true);
          return;
        }
        setOpError(
          useBillingPettyCash.getState().error ||
            "Ocurrió un error. Intenta de nuevo.",
        );
      } catch (err) {
        setOpRunning(false);
        setOpError(String(err));
      }
    },
    [
      mode,
      dataEdit,
      fields,
      proyects,
      pettyCashFunds,
      createPettyCashVoucher,
      updatePettyCashVoucher,
      user?.idEmployee,
      uploadXmlIfNeeded,
      uploadPdfIfNeeded,
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
