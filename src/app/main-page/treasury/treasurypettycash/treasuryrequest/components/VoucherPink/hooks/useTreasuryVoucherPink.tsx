"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallow } from "zustand/shallow";

import {
  computeLoadingFormInfo,
  buildPettyCashVoucherPayload,
  getOptionLabel,
  createInitialFields,
} from "../utilities/treasuryVoucherPink";

import type { FieldModel } from "@/app/components/DynamicForm/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { SubmitFn } from "@/app/main-page/accounting/requisitions/requisitions/components/ExcelLoader/hooks/types";
import {
  UseVoucherFormProps,
  UseVoucherFormReturn,
} from "@/app/main-page/request/pettycash/pettycashrequest/components/VoucherPink/hooks/types";
import type { PostPettyCashVoucher } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import type { EmployeeType } from "@/app/mappings/employees/employee.types";
import type { Proyect } from "@/app/mappings/proyects/proyects.types";
import { useBillingPettyCash } from "@/app/stores/useBillingPettyCash/useBillingPettyCash";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";

/**
 * Gestiona la lógica del formulario de vales rosa desde Tesorería.
 * Carga catálogos, maneja archivos y soporta la selección de empleados.
 */
export const useTreasuryVoucherPink = ({
  mode,
  dataEdit,
  startDisabled,
}: UseVoucherFormProps): UseVoucherFormReturn => {
  const formId = `treasury-petty-cash-voucher-form-${mode}`;
  const isEdit = mode === "edit";
  const { currentPagePermissions, user } = useAuth();
  const { firebasestorage } = useFirebase();
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  const submitRef = useRef<SubmitFn | null>(null);
  const [formReady, setFormReady] = useState(false);
  const [disableForm, setDisableForm] = useState(startDisabled);

  const emptyRef = useRef<FieldModel[]>([]);
  const fields = useFormFieldsStore(
    (s) => s.fieldsByFormId[formId] ?? emptyRef.current,
  );
  const { setFields, updateField, resetFields } = useFormFieldsStore.getState();

  const getFieldValue = useCallback(
    (fieldName: string) => {
      const formFields =
        useFormFieldsStore.getState().fieldsByFormId[formId] ?? [];
      return formFields.find((field) => field.name === fieldName)?.value;
    },
    [formId],
  );

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

  const { employees, employeesError, fetchEmployees, reset: resetEmployees } =
    useEmployeesStore(
      (s) => ({
        employees: s.employees,
        employeesError: s.error,
        fetchEmployees: s.fetchEmployees,
        reset: s.reset,
      }),
      shallow,
    );

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const UpdateEmployees = useCallback(() => {
    if (!employees?.length) return;

    const options = employees.map((employee: EmployeeType) => ({
      label: employee.fullname,
      value: employee.employee_id,
    }));

    const currentValue = getFieldValue("personName") as string | undefined;
    const defaultValue =
      currentValue && options.some((opt) => opt.value === currentValue)
        ? currentValue
        : dataEdit?.employee_id ?? user?.idEmployee ?? options[0]?.value ?? "";

    updateField(formId, "personName", {
      options,
      value: defaultValue,
    });
  }, [
    employees,
    formId,
    updateField,
    dataEdit?.employee_id,
    user?.idEmployee,
    getFieldValue,
  ]);

  const UpdateProyects = useCallback(() => {
    if (proyects?.length) {
      const currentValue = getFieldValue("project") as string | undefined;
      updateField(formId, "project", {
        options: proyects.map((p: Proyect) => ({
          label: p.proyectKey,
          value: p.id,
        })),
        value: dataEdit?.project_id ?? currentValue ?? "",
      });
    }
  }, [proyects, formId, updateField, dataEdit?.project_id, getFieldValue]);

  const ResetForm = useCallback(() => {
    resetFields(formId);
    setTimeout(() => {
      const initialFields: FieldModel[] = createInitialFields({
        dataEdit: undefined,
        defaultEmployeeId: user?.idEmployee,
      });
      setFields(formId, initialFields);
      setTimeout(() => {
        UpdateProyects();
        UpdateEmployees();
        if (user?.idEmployee) {
          updateField(formId, "personName", { value: user.idEmployee });
        }
      }, 250);
    }, 500);
  }, [
    formId,
    resetFields,
    setFields,
    UpdateProyects,
    UpdateEmployees,
    user?.idEmployee,
    updateField,
  ]);

  const {
    createPettyCashVoucher,
    updatePettyCashVoucher,
    resetFlags,
    fetchPettyCashFunds,
    fetchPettyCashVouchersByIdEmployee,
    fetchPettyCashVoucherById,
    pettyCashFunds,
  } = useBillingPettyCash(
    (s) => ({
      createPettyCashVoucher: s.createPettyCashVoucher,
      updatePettyCashVoucher: s.updatePettyCashVoucher,
      resetFlags: s.resetFlags,
      fetchPettyCashFunds: s.fetchPettyCashFunds,
      fetchPettyCashVouchersByIdEmployee: s.fetchPettyCashVouchersByIdEmployee,
      fetchPettyCashVoucherById: s.fetchPettyCashVoucherById,
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

  useEffect(() => {
    if (!isEdit) return;
    if (!fields.length) return;

    const hasXmlField = fields.some((field) => field.name === "xml");
    const hasPdfField = fields.some((field) => field.name === "pdf");

    if (hasXmlField && hasPdfField) {
      return;
    }

    const baseFields = createInitialFields({
      dataEdit,
      defaultEmployeeId: dataEdit?.employee_id ?? user?.idEmployee,
    });
    const nextFields = [...fields];
    const initialLength = nextFields.length;

    const ensureField = (fieldName: "xml" | "pdf") => {
      if (nextFields.some((field) => field.name === fieldName)) {
        return;
      }

      const fieldFromBase = baseFields.find((field) => field.name === fieldName);
      if (!fieldFromBase) {
        return;
      }

      const targetIndex = baseFields.findIndex((field) => field.name === fieldName);
      const insertIndex =
        targetIndex === -1 ? nextFields.length : Math.min(targetIndex, nextFields.length);

      nextFields.splice(insertIndex, 0, fieldFromBase);
    };

    ensureField("xml");
    ensureField("pdf");

    if (nextFields.length !== initialLength) {
      setFields(formId, nextFields);
    }
  }, [dataEdit, fields, formId, isEdit, setFields, user?.idEmployee]);

  useEffect(() => {
    const initialFields: FieldModel[] = createInitialFields({
      dataEdit,
      defaultEmployeeId: dataEdit?.employee_id,
    });
    setFields(formId, initialFields);
    return () => {
      resetFields(formId);
      resetFlags();
    };
  }, [formId, resetFields, resetFlags, setFields, dataEdit]);

  useEffect(() => {
    UpdateEmployees();
  }, [UpdateEmployees]);

  useEffect(() => {
    UpdateProyects();
  }, [UpdateProyects]);

  const loadingFormInfo = useMemo(
    () => computeLoadingFormInfo(fields),
    [fields],
  );

  useEffect(() => {
    if (!dataEdit || loadingFormInfo) return;
    if (dataEdit.employee_id !== undefined) {
      updateField(formId, "personName", { value: dataEdit.employee_id });
    }
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
    if (!dataEdit?.employee_id && user?.idEmployee) {
      updateField(formId, "personName", { value: user.idEmployee });
    }
  }, [user?.idEmployee, dataEdit?.employee_id, formId, updateField]);

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
    if (!employeesError) return;
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se pudo cargar la lista de empleados",
      description: String(employeesError) || "Intenta refrescar.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: () => {
        hideAlert();
        resetEmployees();
      },
      showSecondaryButton: true,
      secondaryLabel: "Refrescar",
      onSecondaryClick: () => {
        hideAlert();
        fetchEmployees(true);
      },
    });
  }, [employeesError, fetchEmployees, hideAlert, resetEmployees, showAlert]);

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

    if (user?.idEmployee) {
      fetchPettyCashVouchersByIdEmployee(user.idEmployee);
    }
    if (isEdit && dataEdit?.id) {
      fetchPettyCashVoucherById(dataEdit.id, true);
    }
    if (!isEdit) {
      ResetForm();
    }
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
    setOpSuccess(false);
  }, [
    opSuccess,
    ResetForm,
    showAlert,
    mode,
    resetFlags,
    user?.idEmployee,
    fetchPettyCashVouchersByIdEmployee,
    isEdit,
    dataEdit?.id,
    fetchPettyCashVoucherById,
  ]);

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

  const uploadXmlIfNeeded = async (
    file: unknown,
  ): Promise<string | undefined> => {
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
    const urlObj = (file as { url?: string } | null | undefined)?.url;
    if (urlObj) return urlObj;
    if (isEdit && dataEdit?.xml) return dataEdit.xml;
    return undefined;
  };

  const uploadPdfIfNeeded = async (
    file: unknown,
  ): Promise<string | undefined> => {
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
    const urlObj = (file as { url?: string } | null | undefined)?.url;
    if (urlObj) return urlObj;
    if (isEdit && dataEdit?.pdf) return dataEdit.pdf;
    return undefined;
  };

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      setOpRunning(true);
      try {
        const employeeId = String(values.personName ?? "");
        const xmlUrl = await uploadXmlIfNeeded(values.xml);
        const pdfUrl = await uploadPdfIfNeeded(values.pdf);

        const payloadValues = {
          ...values,
          xml: xmlUrl ? { url: xmlUrl } : undefined,
          pdf: pdfUrl ? { url: pdfUrl } : undefined,
        };

        const payload: PostPettyCashVoucher = buildPettyCashVoucherPayload({
          values: payloadValues,
          proyects,
          fields,
          pettyCashFundId: pettyCashFunds?.[0]?.id,
          getOptionLabel: (fieldName: string, value: unknown) =>
            getOptionLabel(fields, fieldName, value),
          employeeId,
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
      uploadPdfIfNeeded,
      uploadXmlIfNeeded,
    ],
  );

  return {
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
