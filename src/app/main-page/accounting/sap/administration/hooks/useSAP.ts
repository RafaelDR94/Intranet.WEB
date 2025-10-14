import { useState, useEffect } from "react";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { BillingDocumentsSatTable } from "@/app/mappings/billingdocuments/billingdocuments.types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
const useSAP = () => {
    const [panelOpen, setPanelOpen] = useState<{ state: boolean, onlyText: boolean, rejectInvoice: boolean, sendInvoiceToSap: boolean }>({ state: false, onlyText: false, sendInvoiceToSap: false, rejectInvoice: false });
    const [selected, setSelected] = useState<BillingDocumentsSatTable | null>(null);
    const [multiSelected, setMultiSelected] = useState<BillingDocumentsSatTable[]>([]);
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert
    const { sending, succesSend, sendToSapBillingDocument, fetchSatBillingDocument, billingDocumentsBadCode, billingDocumentsValid, billingDocumentsNotValid, billingDocumentsEfos, loadigSat, error, resetFlags } = useBillingDocumentsStore(
        (s) => ({
            billingDocumentsBadCode: s.billingDocumentsBadCode,
            billingDocumentsValid: s.billingDocumentsValid,
            billingDocumentsNotValid: s.billingDocumentsNotValid,
            billingDocumentsEfos: s.billingDocumentsEfos,
            loadigSat: s.loadigSat,
            sending: s.sending,
            succesSend: s.succesSend,
            resetFlags: s.resetFlags,
            fetchSatBillingDocument: s.fetchSatBillingDocument,
            sendToSapBillingDocument: s.sendToSapBillingDocument,
            error: s.error,
        }),
        shallow
    );
    const handleOpenDetails = (row: BillingDocumentsSatTable, onlyText: boolean, rejectInvoice: boolean, sendInvoiceToSap: boolean) => {
        setSelected(row)
        setPanelOpen({ state: true, onlyText, rejectInvoice, sendInvoiceToSap });
    }
    const handleMultiSelect = (rows: BillingDocumentsSatTable[]) => {
        setMultiSelected(rows);
    }
    const handleSendToSap = () => {
        const ids = multiSelected.map(d => d.billingdocument_id);
        sendToSapBillingDocument(ids);
    }

    useEffect(() => {
        fetchSatBillingDocument(true);
    }, [fetchSatBillingDocument])
    useEffect(() => {
        if (sending) {
            showSpinner({ message: "Enviando Facturas a SAP..." })
            return;
        }
        if (loadigSat) {
            showSpinner({ message: "Obteniendo facturas validadas..." })
            return;
        }
        hideSpinner();
        resetFlags();
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

    }, [loadigSat, error, sending, hideSpinner, resetFlags, showAlert, showSpinner, succesSend])
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
        handleSendToSap
    }
}
export default useSAP
