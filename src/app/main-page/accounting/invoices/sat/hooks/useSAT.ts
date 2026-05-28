import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { shallow } from "zustand/shallow";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { BillingDocuments, BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { SatBillingDocumentsFilterOptions } from "@/app/stores/useBillingDocumentsStore/types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";

const BILLING_DOCUMENT_ID_QUERY_KEY = "billingDocumentId";
const ID_REQUISITION_QUERY_KEY = "idRequisition";
const ID_EMPLOYEE_QUERY_KEY = "idEmployee";

const getFirstQueryValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) return value[0] ? String(value[0]) : undefined;
  if (value === null || value === undefined || value === "") return undefined;
  return String(value);
};

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

  const [selected, setSelected] = useState<BillingDocumentsSatTable | BillingDocuments | null>(
    null
  );
  const [isQueryDrivenPanel, setIsQueryDrivenPanel] = useState(false);
  const [multiSelected, setMultiSelected] = useState<
    BillingDocumentsSatTable[]
  >([]);

  const fetchedByQueryIdRef = useRef<string | null>(null);
  const isOpeningFromQueryRef = useRef(false);
  const isClosingFromQueryRef = useRef(false);

  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
  const { showSpinner, hideSpinner } = usePrincipalLoading;
  const { showAlert } = usePrincipalAlert;
  const { all, updateQuery } = useQuery();

  const satBillingFilter = useMemo<SatBillingDocumentsFilterOptions | undefined>(() => {
    const idRequisition = getFirstQueryValue(all?.[ID_REQUISITION_QUERY_KEY]);
    if (idRequisition) return { idRequisition };

    const idEmployee = getFirstQueryValue(all?.[ID_EMPLOYEE_QUERY_KEY]);
    if (idEmployee) return { idEmployee };

    return undefined;
  }, [all]);

  const {
    fetchSatBillingDocument,
    fetchBillingDocumentById,
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
      fetchBillingDocumentById: s.fetchBillingDocumentById,
      error: s.error,
      sendToSapBillingDocument: s.sendToSapBillingDocument,
      sending: s.sending,
      succesSend: s.succesSend,
    }),
    shallow
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

  // Abre el panel de detalles
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

  // Maneja selecci�n m�ltiple en tablas
  const handleMultiSelect = (rows: BillingDocumentsSatTable[]) => {
    setMultiSelected(rows);
  };

  // Env�o a SAP solo de CFDIs v�lidos
  const handleSendToSap = () => {
    const ids = multiSelected.map((d) => d.billingdocument_id)

    if (!ids.length) {
      if (selected) {
        sendToSapBillingDocument([selected?.billingdocument_id]);
      } else {
        showAlert({
          type: "warning",
          title: "Sin CFDIs v�lidos",
          description: "Solo los CFDIs v�lidos pueden enviarse a SAP.",
          showPrimaryButton: false,
          showSecondaryButton: false,
          autoCloseMs: 2000,
        });
      }

      return;
    }

    sendToSapBillingDocument(ids);
  };

  const handleJsonSapUpdated = useCallback(
    async (billingDocumentId?: string) => {
      const targetId = billingDocumentId ?? selected?.billingdocument_id;
      await fetchSatBillingDocument(true, satBillingFilter);
      if (!targetId) return;
      const refreshed = await fetchBillingDocumentById(targetId, true);
      if (refreshed) setSelected(refreshed);
    },
    [fetchBillingDocumentById, fetchSatBillingDocument, satBillingFilter, selected],
  );

  // Efecto inicial: carga los CFDIs del SAT
  useEffect(() => {
    fetchSatBillingDocument(true, satBillingFilter);
  }, [fetchSatBillingDocument, satBillingFilter]);

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

  // Efectos para controlar estados visuales
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
      showAlert({
        type: "success",
        title: "Facturas enviadas con éxito",
        description: "Las facturas fueron enviadas correctamente a SAP.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
      closeDetailsPanel();
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
    closeDetailsPanel,
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
    closeDetailsPanel,
    handleJsonSapUpdated,
  };
};

export default useSAT;
