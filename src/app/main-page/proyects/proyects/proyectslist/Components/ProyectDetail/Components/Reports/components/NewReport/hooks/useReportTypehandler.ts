import { useState, useEffect, useCallback, useMemo } from "react";
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

    const { report } = useReportBuilderStore();

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


    useEffect(() => {
        if (canStart) {
            fetchReportTypes();
        }

    }, [fetchReportTypes, canStart]);

    const handleTypeChange = useCallback((values: string[]) => {
        const next = values[0] ?? '';
        setSelectedTypeId(next);
    }, []);


    useEffect(() => {
        if (typesofReports.length === 0||!report.front_identifier) return;
        const selectedType = report.type || typesofReports[0]?.id
        setSelectedTypeId(selectedType);
    }, [typesofReports,report]);

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