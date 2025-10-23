import { useState, useEffect } from "react";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useRouter } from "next/navigation";
const useSAT = () => {
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
  const [selected, setSelected] = useState<BillingDocumentsSatTable | null>(
    null,
  );
  const [multiSelected, setMultiSelected] = useState<
    BillingDocumentsSatTable[]
  >([]);
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;
  const router = useRouter();
  const {
    fetchSatBillingDocument,
    billingDocumentsBadCode,
    billingDocumentsValid,
    billingDocumentsNotValid,
    billingDocumentsEfos,
    loadigSat,
    error,
    resetFlags,
    sendToSapBillingDocument,
    sending,
    succesSend,
  } = useBillingDocumentsStore(
    (s) => ({
      billingDocumentsBadCode: s.billingDocumentsBadCode,
      billingDocumentsValid: s.billingDocumentsValid,
      billingDocumentsNotValid: s.billingDocumentsNotValid,
      billingDocumentsEfos: s.billingDocumentsEfos,
      loadigSat: s.loadigSat,
      resetFlags: s.resetFlags,
      fetchSatBillingDocument: s.fetchSatBillingDocument,
      error: s.error,
      sendToSapBillingDocument: s.sendToSapBillingDocument,
      sending: s.sending,
      succesSend: s.succesSend,
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
  const handleSendToSap = (
    documents?: BillingDocumentsSatTable | BillingDocumentsSatTable[],
  ) => {
    const documentsToSend = documents
      ? Array.isArray(documents)
        ? documents
        : [documents]
      : multiSelected;

    const ids = documentsToSend
      .map((d) => d?.billingdocument_id)
      .filter((id): id is string => Boolean(id));

    if (!ids.length) {
      return;
    }

    sendToSapBillingDocument(ids);
  };

  useEffect(() => {
    fetchSatBillingDocument(true);
  }, [fetchSatBillingDocument]);
  useEffect(() => {
    if (sending) {
      showSpinner({ message: "Enviando Facturas a SAP..." });
      return;
    }
    if (loadigSat) {
      showSpinner({ message: "Obteniendo facturas validadas..." });
      return;
    }
    hideSpinner();
    if (succesSend) {
      fetchSatBillingDocument(true);
      showAlert({
        type: "success",
        title: "Facturas enviadas con éxito",
        description: "Las facturas fueron enviadas correctamente a SAP",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      setPanelOpen((prev) => ({ ...prev, state: false }));
      router.push("/main-page/accounting/sap/administration/");
    }

    if (error) {
      showAlert({
        type: "error",
        title: "Error",
        description: String(error) || "Hubo un problema desconocido",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

    resetFlags();
  }, [
    loadigSat,
    error,
    sending,
    hideSpinner,
    resetFlags,
    showAlert,
    showSpinner,
    succesSend,
    router,
    fetchSatBillingDocument,
  ]);
  return {
    handleOpenDetails,
    billingDocumentsValid,
    billingDocumentsEfos,
    billingDocumentsBadCode,
    billingDocumentsNotValid,
    panelOpen,
    setPanelOpen,
    selected,
    multiSelected,
    handleMultiSelect,
    handleSendToSap,
  };
};
export default useSAT;
