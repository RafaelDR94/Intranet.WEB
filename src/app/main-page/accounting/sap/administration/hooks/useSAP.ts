import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { BillingDocuments, BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingDocumentsSAPStore } from "@/app/stores/useBillingDocumentsSAPStore/useBillingDocumentsSAPStore";
import { useBillingCompleteProcessToSAPStore } from "@/app/stores/useBillingCompleteProcessToSAPStore/useBillingCompleteProcessToSAPStore";

const BILLING_DOCUMENT_ID_QUERY_KEY = "billingDocumentId";

const useSAP = () => {
  const [panelOpen, setPanelOpen] = useState<{
    state: boolean;
    onlyText: boolean;
    rejectInvoice: boolean;
    sendInvoiceToSap: boolean;
  }>({ state: false, onlyText: false, sendInvoiceToSap: false, rejectInvoice: false });

  const [selected, setSelected] = useState<BillingDocumentsSatTable | BillingDocuments | null>(null);
  const [multiSelected, setMultiSelected] = useState<BillingDocumentsSatTable[]>([]);
  const [multiSelectedNonDeductible, setMultiSelectedNonDeductible] = useState<
    BillingDocumentsSatTable[]
  >([]);
  const [isQueryDrivenPanel, setIsQueryDrivenPanel] = useState(false);
  const fetchedByQueryIdRef = useRef<string | null>(null);
  const isOpeningFromQueryRef = useRef(false);
  const isClosingFromQueryRef = useRef(false);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;
  const { all, updateQuery } = useQuery();
  const { fetchBillingDocumentById } = useBillingDocumentsStore(
    (s) => ({ fetchBillingDocumentById: s.fetchBillingDocumentById }),
    shallow,
  );

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

  const deductibleDocuments = useMemo(
    () => (billingDocuments ?? []).filter((document) => Boolean(document.uuid?.trim())),
    [billingDocuments],
  );

  const nonDeductibleDocuments = useMemo(
    () => (billingDocuments ?? []).filter((document) => !document.uuid?.trim()),
    [billingDocuments],
  );

  const closeDetailsPanel = useCallback(() => {
    if (isQueryDrivenPanel) {
      isClosingFromQueryRef.current = true;
      isOpeningFromQueryRef.current = false;
      updateQuery({ [BILLING_DOCUMENT_ID_QUERY_KEY]: null });
      return;
    }
    setPanelOpen((prev) => ({ ...prev, state: false }));
    setSelected(null);
  }, [isQueryDrivenPanel, updateQuery]);

  const handleOpenDetails = (
    row: BillingDocumentsSatTable,
    onlyText: boolean,
    rejectInvoice: boolean,
    sendInvoiceToSap: boolean,
    syncWithQuery = false,
  ) => {
    setSelected(row);
    setIsQueryDrivenPanel(syncWithQuery);
    setPanelOpen({ state: true, onlyText, rejectInvoice, sendInvoiceToSap });

    if (syncWithQuery) {
      isOpeningFromQueryRef.current = true;
      isClosingFromQueryRef.current = false;
      updateQuery({ [BILLING_DOCUMENT_ID_QUERY_KEY]: row.billingdocument_id });
    }
  };

  const handleMultiSelect = (rows: BillingDocumentsSatTable[]) => {
    setMultiSelected(rows);
  };

  const handleMultiSelectNonDeductible = (rows: BillingDocumentsSatTable[]) => {
    setMultiSelectedNonDeductible(rows);
  };

  const handleSendToSap = () => {
    const ids = [...multiSelected, ...multiSelectedNonDeductible].map(
      (document) => document.billingdocument_id,
    );
    completeProcessToSAP(ids);
  };

  const handleJsonSapUpdated = useCallback(
    async (billingDocumentId?: string) => {
      const targetId = billingDocumentId ?? selected?.billingdocument_id;
      await fetchBillingDocumentsSAP(true);
      if (!targetId) return;
      const refreshed = await fetchBillingDocumentById(targetId, true);
      if (refreshed) setSelected(refreshed);
    },
    [fetchBillingDocumentById, fetchBillingDocumentsSAP, selected],
  );

  useEffect(() => {
    fetchBillingDocumentsSAP(true);
  }, [fetchBillingDocumentsSAP]);

  const billingDocumentIdFromQuery = useMemo(() => {
    const value = all?.[BILLING_DOCUMENT_ID_QUERY_KEY];
    if (Array.isArray(value)) return value[0] ?? "";
    return value ? String(value) : "";
  }, [all]);

  useEffect(() => {
    if (!billingDocumentIdFromQuery) {
      fetchedByQueryIdRef.current = null;
      if (isOpeningFromQueryRef.current) return;

      if (isClosingFromQueryRef.current || isQueryDrivenPanel) {
        setPanelOpen((prev) => ({ ...prev, state: false }));
        setSelected(null);
        setIsQueryDrivenPanel(false);
        isClosingFromQueryRef.current = false;
      }
      return;
    }

    if (isClosingFromQueryRef.current) return;

    isOpeningFromQueryRef.current = false;
    setIsQueryDrivenPanel(true);
    setPanelOpen((prev) => ({
      ...prev,
      state: true,
      onlyText: true,
      rejectInvoice: true,
      sendInvoiceToSap: true,
    }));

    if (fetchedByQueryIdRef.current === billingDocumentIdFromQuery) return;
    fetchedByQueryIdRef.current = billingDocumentIdFromQuery;

    void fetchBillingDocumentById(billingDocumentIdFromQuery, true).then((doc) => {
      if (doc) setSelected(doc);
    });
  }, [billingDocumentIdFromQuery, fetchBillingDocumentById, isQueryDrivenPanel]);

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
        title: "Facturas enviadas con exito",
        description: "Las facturas fueron enviadas correctamente a SAP",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      closeDetailsPanel();
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
    closeDetailsPanel,
  ]);

  return {
    handleOpenDetails,
    billingDocuments: deductibleDocuments,
    nonDeductibleDocuments,
    panelOpen,
    setPanelOpen,
    selected,
    multiSelected,
    multiSelectedNonDeductible,
    handleMultiSelect,
    handleMultiSelectNonDeductible,
    handleSendToSap,
    closeDetailsPanel,
    handleJsonSapUpdated,
  };
};

export default useSAP;
