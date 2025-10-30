import { shallow } from "zustand/shallow";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import { useEffect, useState, useMemo, useCallback } from "react";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { CreatePDF } from "@/app/utilities/PDF/PDF";
import useVehicleDocuments from "../../../../hooks/useVehicleDocuments";
const useRegisterDetails = () => {
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showAlert } = usePrincipalAlert;
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { currentAssignment, fetchAssignmentById, error, loadingdetails } = useTransportStore(
        (s) => ({
            loadingdetails: s.loadingVehicleTracking,
            fetchAssignmentById: s.fetchAssignmentById,
            currentAssignment: s.currentAssignment,
            error: s.error,
        }),
        shallow
    );


    const { canGenerate, makeDocument, makeResponsive } = useVehicleDocuments();
    const [generatingType, setGeneratingType] = useState<"arrival" | "departure" | null>(null);
    const [generatingResponsive, setGeneratingResponsive] = useState(false);
    const departureDate = currentAssignment?.vehicletrackinglist?.[0] ? currentAssignment?.vehicletrackinglist[0].date : ""
    const arrivalDate = currentAssignment?.vehicletrackinglist?.[1] ? currentAssignment?.vehicletrackinglist[1].date : ""
    const hasArrival = useMemo(() => {
        return Boolean(currentAssignment?.vehicletrackinglist?.some((item) => item.vehicleEntryExit));
    }, [currentAssignment?.vehicletrackinglist]);
    const hasDeparture = useMemo(() => {
        const hasDepartureTracking = currentAssignment?.vehicletrackinglist?.some((item) => item.vehicleEntryExit === false);
        return hasDepartureTracking || (currentAssignment?.vehicletrackinglist?.length ?? 0) > 0;
    }, [currentAssignment?.vehicletrackinglist]);

    const handleDownloadDocument = useCallback(async (type: "arrival" | "departure") => {
        if (!currentAssignment || !canGenerate || generatingType) return;
        const isArrival = type === "arrival";
        const hasData = isArrival ? hasArrival : hasDeparture;
        if (!hasData) {
            showAlert({
                type: "warning",
                title: "Informacion incompleta",
                description: `No se encontro un registro de ${isArrival ? "llegada" : "salida"} para generar el documento.`,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 2500,
            });
            return;
        }
        try {
            setGeneratingType(type);
            showSpinner({ message: "Generando documento..." });
            const pdfData = await makeDocument(isArrival);
            if (!pdfData) {
                throw new Error("No se pudo construir el documento");
            }
            const url = await new Promise<string>((resolve, reject) => {
                try {
                    CreatePDF(pdfData, resolve);
                } catch (err) {
                    reject(err);
                }
                setTimeout(() => reject(new Error("Tiempo de espera excedido al generar el PDF")), 10000);
            });
            const filename = `registro-vehicular-${currentAssignment.vehicleassignments_id}-${isArrival ? "llegada" : "salida"}.pdf`;
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
            showAlert({
                type: "info",
                title: "Documento generado",
                description: `El PDF de ${isArrival ? "llegada" : "salida"} se descargo correctamente.`,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 2000,
            });
        } catch (error) {
            console.error("[vehicle-documents] Error generando PDF", error);
            const message = error instanceof Error ? error.message : "Intenta nuevamente en unos segundos.";
            showAlert({
                type: "error",
                title: "No se pudo generar el PDF",
                description: message,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 2500,
            });
        } finally {
            hideSpinner();
            setGeneratingType(null);
        }
    }, [canGenerate, currentAssignment, generatingType, hasArrival, hasDeparture, hideSpinner, makeDocument, showAlert, showSpinner]);

    const handleDownloadResponsive = useCallback(async () => {
        if (!currentAssignment || generatingResponsive) return;
        if (!currentAssignment.employee_id || !currentAssignment.transport?.transport_id) {
            showAlert({
                type: "warning",
                title: "Informacion incompleta",
                description: "No se pudo identificar al empleado o al vehiculo asignado.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 2500,
            });
            return;
        }
        try {
            setGeneratingResponsive(true);
            showSpinner({ message: "Generando responsiva..." });
            const pdfData = await makeResponsive();
            if (!pdfData) {
                throw new Error("No se pudo construir la responsiva");
            }
            const url = await new Promise<string>((resolve, reject) => {
                try {
                    CreatePDF(pdfData, resolve);
                } catch (err) {
                    reject(err);
                }
                setTimeout(() => reject(new Error("Tiempo de espera excedido al generar el PDF")), 10000);
            });
            const filename = `responsiva-vehicular-${currentAssignment.vehicleassignments_id}.pdf`;
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = filename;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            setTimeout(() => URL.revokeObjectURL(url), 5000);
            showAlert({
                type: "info",
                title: "Documento generado",
                description: "La responsiva se descargo correctamente.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 2000,
            });
        } catch (error) {
            console.error("[vehicle-documents] Error generando responsiva", error);
            const message = error instanceof Error ? error.message : "Intenta nuevamente en unos segundos.";
            showAlert({
                type: "error",
                title: "No se pudo generar la responsiva",
                description: message,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 2500,
            });
        } finally {
            hideSpinner();
            setGeneratingResponsive(false);
        }
    }, [currentAssignment, generatingResponsive, hasArrival, hideSpinner, makeResponsive, showAlert, showSpinner]);


    useEffect(() => {
        if (!currentAssignment) return;
        if (!currentAssignment.vehicletrackinglist || currentAssignment.vehicletrackinglist.length === 0) {
            fetchAssignmentById(currentAssignment.vehicleassignments_id, true);
        }
    }, [currentAssignment, fetchAssignmentById]);

    useEffect(() => {
        if (loadingdetails) { showSpinner({ message: "Cargando detalles" }); return; }
        if (error) {
            showAlert({
                type: 'error',
                variant: 'subtle',
                title: 'Error obteniendo detalles',
                description: error || 'No se pudieron obtener los detalles del registro del vehículo.',
                autoCloseMs: 1200,
                showPrimaryButton: false,
                showSecondaryButton: false,
            });
        }
        hideSpinner();
    }, [loadingdetails, error, showAlert, hideSpinner]);
    return {
        currentAssignment,
        departureDate,
        arrivalDate,
        hasArrival,
        hasDeparture,
        canGenerate,
        generatingType,
        generatingResponsive,
        handleDownloadDocument,
        handleDownloadResponsive
    };
}
export default useRegisterDetails;