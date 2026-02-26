"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { shallow } from "zustand/shallow";

import {
  computeLoadingFormInfo,
  buildPettyCashVoucherPayload,
  getOptionLabel,
  createInitialFields,
} from "../utilities/voucherBlue";

import { UseVoucherFormProps, UseVoucherFormReturn } from "./types";

import type { FieldModel } from "@/app/components/DynamicForm/types";
import type { SelectOption } from "@/app/components/Select/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { SubmitFn } from "@/app/main-page/accounting/requisitions/requisitions/components/ExcelLoader/hooks/types";
import type { PostPettyCashVoucher } from "@/app/mappings/billingPettyCash/BillingPettyCash.types";
import type { PostAuthorization } from "@/app/mappings/authorizations/authorizations.types";
import type { Proyect } from "@/app/mappings/proyects/proyects.types";
import { useBillingPettyCash } from "@/app/stores/useBillingPettyCash/useBillingPettyCash";
import { useAuthorizationsStore } from "@/app/stores/useAuthorizationsStore/useAuthorizationsStore";
import { useEmployeesStore } from "@/app/stores/useEmployeesStore/useEmployeesStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";

/**
 * Gestiona la lógica del formulario de vales azules de caja chica.
 * Carga catálogos, maneja envíos y expone helpers para el componente.
 */
export const useVoucherBlue = ({
  mode,
  dataEdit,
  startDisabled,
  readOnlyFieldNames,
}: UseVoucherFormProps): UseVoucherFormReturn => {
  const formId = `petty-cash-voucher-blue-form-${mode}`;
  const isEdit = mode === "edit";
  const { currentPagePermissions, user } = useAuth();
  // Principal (spinner + alert)
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert, hideAlert } = usePrincipalAlert;

  // Submit externo (DynamicForm)
  const submitRef = useRef<SubmitFn | null>(null);
  const [formReady, setFormReady] = useState(false);
  const [disableForm, setDisableForm] = useState(startDisabled);
  const [authorizerPopUpOpen, setAuthorizerPopUpOpen] = useState(false);
  const [authorizerSelected, setAuthorizerSelected] = useState("");
  const [authorizerError, setAuthorizerError] = useState<string | null>(null);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    setDisableForm(startDisabled);
  }, [startDisabled]);

  // Form Fields (multi-instancia por formId)
  const emptyRef = useRef<FieldModel[]>([]);
  const fields = useFormFieldsStore(
    (s) => s.fieldsByFormId[formId] ?? emptyRef.current,
  );
  const { setFields, updateField, resetFields } = useFormFieldsStore.getState();

  useEffect(() => {
    if (!readOnlyFieldNames?.length) {
      return;
    }

    if (!fields.length) {
      return;
    }

    readOnlyFieldNames.forEach((fieldName) => {
      const field = fields.find((item) => item.name === fieldName);
      if (!field || field.disabled) {
        return;
      }

      updateField(formId, fieldName, { disabled: true });
    });
  }, [fields, formId, readOnlyFieldNames, updateField]);

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

  const { createAuthorization } = useAuthorizationsStore(
    (state) => ({
      createAuthorization: state.createAuthorization,
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

  const authorizerOptions = useMemo<SelectOption[]>(
    () =>
      (employees ?? []).map((employee) => ({
        label: employee.fullname,
        value: employee.employee_id,
      })),
    [employees],
  );

  useEffect(() => {
    if (authorizerSelected) return;
    if (!authorizerOptions.length) return;
    setAuthorizerSelected(authorizerOptions[0].value);
  }, [authorizerOptions, authorizerSelected]);

  useEffect(() => {
    if (authorizerSelected && authorizerError) {
      setAuthorizerError(null);
    }
  }, [authorizerError, authorizerSelected]);

  const handleSubmit = useCallback(
    async (values: Record<string, any>) => {
      setOpRunning(true);
      try {
        if (!isEdit && !authorizerSelected) {
          setOpRunning(false);
          setAuthorizerError("Selecciona un autorizador.");
          return;
        }

        const payload: PostPettyCashVoucher = buildPettyCashVoucherPayload({
          values: {
            ...values,
          },
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

        if (res) {
          if (!isEdit) {
            const applicantId = user?.idEmployee ?? "";
            const applicant = employees?.find(
              (employee) => employee.employee_id === applicantId,
            );
            const authPayload: PostAuthorization = {
              authorization_id: "",
              applicant_id: applicantId,
              authorizer_id: authorizerSelected,
              enterprise_id:
                applicant?.department?.enterprise_id ??
                user?.idEnterprise ??
                "",
              department_id:
                applicant?.department?.department_id ??
                user?.idDepartment ??
                "",
              kind: "Vale azul",
              proyect_id: payload.project_id,
              event_id: res.id,
            };

            const createdAuthorization = await createAuthorization(authPayload);
            if (!createdAuthorization) {
              setOpRunning(false);
              setOpError(
                useAuthorizationsStore.getState().error ||
                  "No se pudo crear la autorizacion.",
              );
              return;
            }
          }

          setOpRunning(false);
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
      isEdit,
      authorizerSelected,
      employees,
      user?.idEnterprise,
      user?.idDepartment,
      createAuthorization,
    ],
  );

  const handleAuthorizerConfirm = useCallback(() => {
    if (!authorizerSelected) {
      setAuthorizerError("Selecciona un autorizador.");
      return;
    }
    setAuthorizerError(null);
    setAuthorizerPopUpOpen(false);
    setPendingSubmit(true);
  }, [authorizerSelected]);

  const handleAuthorizerCancel = useCallback(() => {
    setAuthorizerPopUpOpen(false);
    setAuthorizerError(null);
  }, []);

  useEffect(() => {
    if (!pendingSubmit) return;
    setPendingSubmit(false);
    submitRef.current?.();
  }, [pendingSubmit]);

  return {
    // para el componente
    fields,
    loadingFormInfo,
    formReady,
    setFormReady,
    submitRef,
    handleSubmit,
    onSubmit: () => {
      if (isEdit) {
        submitRef.current?.();
        return;
      }
      setAuthorizerPopUpOpen(true);
    },
    buttonDisabled: !formReady,
    currentPagePermissions,
    disableForm,
    setDisableForm,
    authorizerOptions,
    authorizerSelected,
    setAuthorizerSelected,
    authorizerPopUpOpen,
    setAuthorizerPopUpOpen,
    authorizerError,
    handleAuthorizerConfirm,
    handleAuthorizerCancel,
  };
};
