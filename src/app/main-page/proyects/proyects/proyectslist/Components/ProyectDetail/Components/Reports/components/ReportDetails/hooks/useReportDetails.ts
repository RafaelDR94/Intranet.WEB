import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore"
import { useEffect } from "react";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";

const useReportDetails = () => {


    const { currentReport, fetchReportsById, fetchLocalReportById, loadingCurrent, error, resetFlags } = useReportsStore();
    const { updateQuery, all } = useQuery();
    const reportId = all.reportId;
    const frontId = all.frontId;
    const { usePrincipalAlert } = usePrincipal();
    const { showAlert } = usePrincipalAlert;
    useEffect(() => {
        if (reportId) {
            void fetchReportsById(String(reportId), true);
            return;
        }
        if (frontId) {
            void fetchLocalReportById(String(frontId), true);
        }
    }, [reportId, frontId, fetchReportsById, fetchLocalReportById]);

    useEffect(() => {
        if (loadingCurrent) return;
        if (error) {
            showAlert({
                type: "error",
                title: "Ocurrio un error",
                description: String(error) || "Hubo un problema al obtener leer el reporte",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            updateQuery({ reportId: null, frontId: null });
            resetFlags();
        }

    }, [error, loadingCurrent, resetFlags, showAlert, updateQuery]);
    return { currentReport, loadingCurrent }
}
export default useReportDetails
