import { useState, useEffect } from "react";
import { shallow } from "zustand/shallow";

import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { useBillingDocumentsStore } from "@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore";
import { useBillingHistoryStore } from "@/app/stores/useBillingHistoryStore/useBillingHistoryStore";
import { useBillingImagesStore } from "@/app/stores/useBillingImagesStore/useBillingImagesStore";

const usePettyCashHistory = () => {
    const { user } = useAuth();
    const [panelOpen, setPanelOpen] = useState(false)
    const [selected, setSelected] = useState<HistoryRow | null>(null)
    const { usePrincipalLoading } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading
    // Mock adaptado al nuevo tipo
    const { history, loading, forceFetchBillingHistory } = useBillingHistoryStore(
        (s) => ({
            history: s.history,
            loading: s.loading,
            forceFetchBillingHistory: s.forceFetchBillingHistory,

        }),
        shallow
    );

    const { successPut } = useBillingDocumentsStore(
        (s) => ({
            successPut: s.successPut,
        }),
        shallow
    )

    const { successPutImages } = useBillingImagesStore(
        (s) => ({
            successPutImages: s.successPut,
        }),
        shallow
    )
    const rejected = history.filter((r) => r.status.toLowerCase() === 'prohibido' || r.status.toLowerCase() === 'invalido' || r.status.toLowerCase() === 'rechazado' || r.status.toLowerCase() === 'rechazado'|| r.status.toLowerCase() === 'restringido')
    useEffect(() => {
        if (user) forceFetchBillingHistory(user?.idEmployee ?? "");
    }, [user, forceFetchBillingHistory])
    useEffect(() => {
        if (loading) {
            showSpinner({ message: "Obteniendo historial..." })
            return;
        }
        if (successPut) setPanelOpen(false);
        if (successPutImages) setPanelOpen(false);
        hideSpinner();
    }, [loading, successPut, successPutImages, hideSpinner, showSpinner])
    return { panelOpen, setPanelOpen, selected, setSelected, rejected, history, loading }


}
export default usePettyCashHistory;
