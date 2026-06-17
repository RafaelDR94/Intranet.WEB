import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
import useReportBuilderStore from "@/app/stores/useReportBuilderStore/useReportBuilderStore";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";

type useReportTypeHandlerProps = {
    canStart: boolean
}

const useReportTypehandler = ({ canStart }: useReportTypeHandlerProps) => {
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showAlert, hideAlert } = usePrincipalAlert;
    const { showSpinner, hideSpinner } = usePrincipalLoading;

    const [selectedTypeId, setSelectedTypeId] = useState('');
    const initializedReportRef = useRef<string>("");

    const { report, updateModel } = useReportBuilderStore();

    const {
        typesofReports,
        fetchReportTypes,
        fetchReportCategories,
        loadingTypes,
        loadingCategories,
        error,
        resetFlags

    } = useReportsStore();

    const typeOptions = useMemo(
        () => typesofReports.map((type) => ({ label: type.name, value: type.id })),
        [typesofReports]
    );
    const currentReportKey = report.front_identifier || report.id || "__draft__";


    useEffect(() => {
        if (canStart) {
            fetchReportTypes();
        }

    }, [fetchReportTypes, canStart]);

    const handleTypeChange = useCallback((values: string[]) => {
        const next = values[0] ?? '';
        if (!next || next === selectedTypeId) return;
        setSelectedTypeId(next);
    }, [selectedTypeId]);


    useEffect(() => {
        if (typesofReports.length === 0) return;
        const shouldInitialize =
            initializedReportRef.current !== currentReportKey || !selectedTypeId;

        if (!shouldInitialize) return;

        const selectedType =
            report.type?.trim() ||
            report.reportcategories?.typesofreports?.id ||
            typesofReports[0]?.id ||
            "";

        if (!selectedType) return;

        initializedReportRef.current = currentReportKey;
        setSelectedTypeId(selectedType);

        if (report.type !== selectedType) {
            updateModel({ type: selectedType });
        }
    }, [
        currentReportKey,
        report.reportcategories?.typesofreports?.id,
        report.type,
        selectedTypeId,
        typesofReports,
        updateModel,
    ]);

    useEffect(() => {
        if (!selectedTypeId) return;
        fetchReportCategories(selectedTypeId);
    }, [fetchReportCategories, selectedTypeId, typesofReports]);

    useEffect(() => {
        if (loadingTypes) {
            showSpinner({ message: 'Cargando tipos de reporte...' });
            return;
        }
        if (loadingCategories) {
            showSpinner({ message: 'Cargando categorías...' });
            return;
        }
        if (error) {
            showAlert({
                type: 'error',
                variant: 'filled',
                title: "Error cargando listas",
                description: error,
                autoCloseMs: 3000,
                showPrimaryButton: false,
                showSecondaryButton: false,
                onClose: hideAlert,
            });
        }
        ;
        hideSpinner();
        resetFlags();
    }, [loadingTypes, loadingCategories, error, hideSpinner, showSpinner, showAlert, resetFlags]);




    return { typeOptions, selectedTypeId, handleTypeChange }
}
export default useReportTypehandler
