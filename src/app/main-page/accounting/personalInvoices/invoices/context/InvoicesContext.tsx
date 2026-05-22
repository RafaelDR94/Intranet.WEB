"use client"
import { usePathname, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { shallow } from "zustand/shallow";

import { InvoicesContextType } from "./types";

import { FieldModel } from "@/app/components/DynamicForm/types";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { useRequisitionsStore } from "@/app/stores/useRequisitionStore/useRequisitionStore";

// 2️⃣ Valor inicial por defecto
const initialValue: InvoicesContextType = {
  billingDocumentDescription: [],
  billingCategories: [],
  requisitions: [],
  field1: [],
  field2: [],
  formId1: "invoices-form",
  formId2: "ticket-form",
  setFields: () => {},
  updateField: () => {},
  resetFields: () => {},
  user: null,
  targetEmployeeId: "",
};

// 3️⃣ Crear contexto
const InvoicesContext = createContext<InvoicesContextType>(initialValue);

// 4️⃣ Provider
export const InvoicesProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlEmployeeId = searchParams.get("idEmployee") ?? "";
  const { user } = useAuth();
  const normalizedPath = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const formId1 = "invoices-form";
  const formId2 = "ticket-form";
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert, hideAlert } = usePrincipalAlert;

  const {
    requisitions,
    requisitionsError,
    warning,
    fetchRequisitionsByIdEmployee,
    fetchRequisitions,
    resetFlags,
  } = useRequisitionsStore(
    (s) => ({
      requisitions: s.requisitions,
      requisitionsError: s.error,
      warning: s.warning,
      fetchRequisitionsByIdEmployee: s.fetchRequisitionsByIdEmployee,
      fetchRequisitions: s.fetchRequisitions,
      resetFlags: s.resetFlags,
      reset: s.reset,
    }),
    shallow,
  );

  const {
    billingDocumentDescription,
    billingCategories,
    billingerror,
    fetchBillingDocumentCategories,
    fetchBillingDocumentDescriptions,
    resetBillingFlags,
  } = useBillingDocumentsStore(
    (s) => ({
      billingDocumentDescription: s.billingDocumentDescription,
      billingCategories: s.billingCategories,
      billingerror: s.error,
      fetchBillingDocumentCategories: s.fetchBillingDocumentCategories,
      fetchBillingDocumentDescriptions: s.fetchBillingDocumentDescriptions,
      resetBillingFlags: s.resetFlags,
    }),
    shallow,
  );

  const { setFields, updateField, resetFields } = useFormFieldsStore.getState();

  const EMPTY_ARRAY: FieldModel[] = [];

  const f1 = useFormFieldsStore((s) => s.fieldsByFormId[formId1]); // <- sin ?? []
  const f2 = useFormFieldsStore((s) => s.fieldsByFormId[formId2]); // <- sin ?? []

  const field1 = f1 ?? EMPTY_ARRAY; // coalesce fuera del selector
  const field2 = f2 ?? EMPTY_ARRAY;

  const shouldUseAuthenticatedEmployeeOnly =
    normalizedPath.startsWith("/main-page/request/");
  const targetEmployeeId = shouldUseAuthenticatedEmployeeOnly
    ? user?.idEmployee || ""
    : urlEmployeeId || user?.idEmployee || "";

  useEffect(() => {
    if (pathname == "/main-page/accounting/invoices/addFiles/") {
      fetchRequisitions(true);
      return;
    }
    if (targetEmployeeId) fetchRequisitionsByIdEmployee(targetEmployeeId, true);
  }, [targetEmployeeId, pathname, fetchRequisitions, fetchRequisitionsByIdEmployee]);
  useEffect(() => {
    fetchBillingDocumentCategories();
    fetchBillingDocumentDescriptions("");
  }, [fetchBillingDocumentCategories, fetchBillingDocumentDescriptions]);

  useEffect(() => {
    if (!requisitionsError) return;
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se pudo cargar la lista de empleados",
      description: String(requisitionsError) || "Intenta refrescar.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: "Refrescar",
      onSecondaryClick: () => {
        hideAlert();
        if (targetEmployeeId) fetchRequisitionsByIdEmployee(targetEmployeeId, true);
      },
    });
    resetFlags();
    resetBillingFlags();
  }, [
    requisitionsError,
    hideAlert,
    showAlert,
    targetEmployeeId,
    fetchRequisitionsByIdEmployee,
    resetFlags,
    resetBillingFlags,
  ]);

  useEffect(() => {
    if (!billingerror) return;
    showAlert({
      type: "error",
      variant: "filled",
      title: "No se pudo cargar al menos una lista",
      description: String(billingerror) || "Intenta refrescar.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: "Refrescar",
      onSecondaryClick: () => {
        hideAlert();
        fetchBillingDocumentCategories();
        fetchBillingDocumentDescriptions("");
      },
    });
    resetFlags();
    resetBillingFlags();
  }, [
    billingerror,
    hideAlert,
    showAlert,
    fetchBillingDocumentCategories,
    fetchBillingDocumentDescriptions,
    resetFlags,
    resetBillingFlags,
  ]);

  useEffect(() => {
    if (!warning) return;
    showAlert({
      type: "warning",
      variant: "filled",
      title: "Sin requisiciones",
      description: warning ?? "Intenta refrescar.",
      showPrimaryButton: true,
      primaryLabel: "Entendido",
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: "Refrescar",
      onSecondaryClick: () => {
        hideAlert();
        if (targetEmployeeId) fetchRequisitionsByIdEmployee(targetEmployeeId, true);
      },
    });
    resetFlags();
  }, [
    warning,
    targetEmployeeId,
    hideAlert,
    showAlert,
    fetchRequisitionsByIdEmployee,
    resetFlags,
  ]);

  // 🧠 Memoizar el value para evitar renders innecesarios
  const value = useMemo(
    () => ({
      billingDocumentDescription,
      billingCategories,
      requisitions,
      field1,
      field2,
      formId1,
      formId2,
      setFields,
      updateField,
      resetFields,
      user,
      targetEmployeeId,
    }),
    [
      billingDocumentDescription,
      billingCategories,
      requisitions,
      field1,
      field2,
      formId1,
      formId2,
      user,
      targetEmployeeId,
      setFields,
      updateField,
      resetFields,
    ], // solo cambia cuando invoices cambie
  );

  return (
    <InvoicesContext.Provider value={value}>
      {children}
    </InvoicesContext.Provider>
  );
};

// 5️⃣ Hook para consumir el contexto
export const useInvoices = () => {
  const context = useContext(InvoicesContext);
  if (!context) {
    throw new Error("useInvoices debe usarse dentro de un InvoicesProvider");
  }
  return context;
};
