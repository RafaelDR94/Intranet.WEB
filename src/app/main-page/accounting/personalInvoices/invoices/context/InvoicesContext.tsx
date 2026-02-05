"use client";
import { usePathname } from "next/navigation";
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
};

// 3️⃣ Crear contexto
const InvoicesContext = createContext<InvoicesContextType>(initialValue);

// 4️⃣ Provider
export const InvoicesProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const { user } = useAuth();
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

  useEffect(() => {
    if (pathname == "/main-page/accounting/invoices/addFiles/") {
      fetchRequisitions(true);
    } else if (user) fetchRequisitionsByIdEmployee(user.idEmployee, true);
  }, [user, pathname, fetchRequisitions, fetchRequisitionsByIdEmployee]);
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
        if (user) fetchRequisitionsByIdEmployee(user?.idEmployee, true);
      },
    });
    resetFlags();
    resetBillingFlags();
  }, [
    requisitionsError,
    hideAlert,
    showAlert,
    user,
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
        if (user) fetchRequisitionsByIdEmployee(user?.idEmployee, true);
      },
    });
    resetFlags();
  }, [
    warning,
    user,
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
