import { useState, useEffect } from "react";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { useBillingDocumentsSAPStore } from "@/app/stores/useBillingDocumentsSAPStore/useBillingDocumentsSAPStore";
import { useBillingCompleteProcessToSAPStore } from "@/app/stores/useBillingCompleteProcessToSAPStore/useBillingCompleteProcessToSAPStore";

const useSapOperationsPage = () => {
  const [panelOpen, setPanelOpen] = useState<{
    state: boolean;
    onlyText: boolean;
    rejectInvoice: boolean;
    sendInvoiceToSap: boolean;
  }>({
    state: false,
    onlyText: false,
    sendInvoiceToSap: false,
    rejectInvoice: false,
  });

  const [selected, setSelected] = useState<BillingDocumentsSatTable | null>(null);
  const [multiSelected, setMultiSelected] = useState<BillingDocumentsSatTable[]>([]);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;

  // ✅ Nuevo: solo una lista `billingDocuments`
  const {
    billingDocuments,
    fetchBillingDocumentsSAP,
    loading: sapLoading,
    error: sapError,
    resetFlags: resetSapFlags,
  } = useBillingDocumentsSAPStore(
    (s) => ({
      billingDocuments: s.billingDocuments,
      fetchBillingDocumentsSAP: s.fetchBillingDocumentsSAP,
      loading: s.loading,
      error: s.error,
      resetFlags: s.resetFlags,
    }),
    shallow,
  );

  const {
    sending,
    success,
    completeProcessToSAP,
    error,
    resetFlags: resetCompleteProcessFlags,
  } = useBillingCompleteProcessToSAPStore(
    (s) => ({
      sending: s.sending,
      success: s.success,
      completeProcessToSAP: s.completeProcessToSAP,
      error: s.error,
      resetFlags: s.resetFlags,
    }),
    shallow,
  );

  const handleOpenDetails = (
    row: BillingDocumentsSatTable,
    onlyText: boolean,
    rejectInvoice: boolean,
    sendInvoiceToSap: boolean,
  ) => {
    setSelected(row);
    setPanelOpen({ state: true, onlyText, rejectInvoice, sendInvoiceToSap });
  };

  const handleMultiSelect = (rows: BillingDocumentsSatTable[]) => {
    setMultiSelected(rows);
  };

  const handleSendToSap = () => {
    const ids = multiSelected.map((d) => d.billingdocument_id);
    completeProcessToSAP(ids);
  };

  useEffect(() => {
    fetchBillingDocumentsSAP(true);
  }, [fetchBillingDocumentsSAP]);

  useEffect(() => {
    if (sending) {
      showSpinner({ message: "Enviando Facturas a SAP..." });
      return;
    }

    if (sapLoading) {
      showSpinner({ message: "Obteniendo facturas validadas..." });
      return;
    }

    hideSpinner();

    if (success) {
      fetchBillingDocumentsSAP(true);
      showAlert({
        type: "success",
        title: "Facturas enviadas con éxito",
        description: "Las facturas fueron enviadas correctamente a SAP",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    const errorMessage = error ?? sapError;
    if (errorMessage) {
      showAlert({
        type: "error",
        title: "Error",
        description: String(errorMessage) || "Hubo un problema desconocido",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    resetSapFlags();
    resetCompleteProcessFlags();
  }, [
    sapLoading,
    sapError,
    error,
    sending,
    hideSpinner,
    resetCompleteProcessFlags,
    resetSapFlags,
    showAlert,
    showSpinner,
    success,
    fetchBillingDocumentsSAP,
  ]);

  return {
    handleOpenDetails,
    billingDocuments, // 🔹 reemplaza las 4 listas
    panelOpen,
    setPanelOpen,
    selected,
    multiSelected,
    handleMultiSelect,
    handleSendToSap,
  };
};

export default useSapOperationsPage;
