import { useState, useEffect } from "react";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingDocumentsSAPStore } from "@/app/stores/useBillingDocumentsSAPStore/useBillingDocumentsSAPStore";

const useSAP = () => {
  const [panelOpen, setPanelOpen] = useState<{
    state: boolean;
    onlyText: boolean;
    rejectInvoice: boolean;
    sendInvoiceToSap: boolean;
  }>({ state: false, onlyText: false, sendInvoiceToSap: false, rejectInvoice: false });

  const [selected, setSelected] = useState<BillingDocumentsSatTable | null>(null);
  const [multiSelected, setMultiSelected] = useState<BillingDocumentsSatTable[]>([]);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;

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
    succesSend,
    sendToSapBillingDocument,
    error,
    resetFlags,
  } = useBillingDocumentsStore(
    (s) => ({
      sending: s.sending,
      succesSend: s.succesSend,
      resetFlags: s.resetFlags,
      sendToSapBillingDocument: s.sendToSapBillingDocument,
      error: s.error,
    }),
    shallow,
  );

  const handleOpenDetails = (
    row: BillingDocumentsSatTable,
    onlyText: boolean,
    rejectInvoice: boolean,
    sendInvoiceToSap: boolean
  ) => {
    setSelected(row);
    setPanelOpen({ state: true, onlyText, rejectInvoice, sendInvoiceToSap });
  };

  const handleMultiSelect = (rows: BillingDocumentsSatTable[]) => {
    setMultiSelected(rows);
  };

  const handleSendToSap = () => {
    const ids = multiSelected.map((d) => d.billingdocument_id);
    sendToSapBillingDocument(ids);
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
    resetFlags();
    resetSapFlags();

    if (succesSend) {
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
  }, [
    sapLoading,
    sapError,
    error,
    sending,
    hideSpinner,
    resetFlags,
    resetSapFlags,
    showAlert,
    showSpinner,
    succesSend,
  ]);

  return {
    handleOpenDetails,
    billingDocuments, // 🔹 Ahora una sola lista de documentos
    panelOpen,
    setPanelOpen,
    selected,
    multiSelected,
    handleMultiSelect,
    handleSendToSap,
  };
};

export default useSAP;
