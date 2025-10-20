import { useCallback, useMemo, useState } from "react";

import useRegisterDetails from "./hooks/useRegisterDetails";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import Information from "./components/Information/Information";
import ArrivePictures from "./components/ArrivePictures/ArrivePictures";
import DeparturePictures from "./components/DeparturePictures/DeparturePictures";
import Signatures from "./components/Signatures/Signatures";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import { Button } from "@/app/components/Button/Button";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import useVehicleDocuments from "@/app/main-page/generalservices/vehicleregist/hooks/useVehicleDocuments";
import { CreatePDF } from "@/app/utilities/PDF/PDF";
import { formatDateHour } from "@/app/utilities/DatesHelper/Dateshelper";
export interface RegistDetailsProps {
    onClose: () => void;
    open: boolean;
}
const RegistDetails = ({ onClose, open }: RegistDetailsProps) => {
    const { currentAssignment } = useRegisterDetails();
    const { canGenerate, makeDocument, makeResponsive } = useVehicleDocuments();
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showAlert } = usePrincipalAlert;
    const { showSpinner, hideSpinner } = usePrincipalLoading;
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

    return (

        <DetailsPanelLayout onClose={onClose} open={open}
            leftLabel={"Fecha Salida " + formatDateHour(departureDate)}
            rightLabel={arrivalDate ? "Fecha Llegada " + formatDateHour(arrivalDate) : ""}

            actionButton={
                <h1 className="text-green-100 text-s1 font-semibold ">Registro Vehicular</h1>
            }
            renderActions={() => (
                <div className="flex gap-2">
                    {currentAssignment && (
                        <>
                            <Button
                                size="xsmall"
                                variant="ghost"
                                icon={PDFIcon}
                                onClick={() => handleDownloadDocument("departure")}
                                disabled={!canGenerate || !hasDeparture || generatingType !== null || generatingResponsive}
                            >
                                Salida
                            </Button>
                            {hasArrival && (
                                <Button
                                    size="xsmall"
                                    variant="ghost"
                                    icon={PDFIcon}
                                    onClick={() => handleDownloadDocument("arrival")}
                                    disabled={!canGenerate || generatingType !== null || generatingResponsive}
                                >
                                    Llegada
                                </Button>
                            )}

                            <Button
                                size="xsmall"
                                variant="ghost"
                                icon={PDFIcon}
                                onClick={() => handleDownloadResponsive()}
                                disabled={!canGenerate || generatingType !== null || generatingResponsive}
                            >
                                Responsiva
                            </Button>

                        </>
                    )}

                </div>
            )}>

            <div className="space-y-4">
                <ButtonsNavigation
                    dataTestId="reportdetails-nav"
                    ariaLabel="Secciones del reporte"
                    buttonSize="small"
                    activeVariant="solid"
                    inactiveVariant="outline"
                >
                    <ButtonsNavigation.Item id="info" label="Información" renderContent={<Information />} />
                    <ButtonsNavigation.Item id="arrive" label="Fotografía Salida" className="rounded-full" renderContent={<DeparturePictures />} />
                    {arrivalDate && <ButtonsNavigation.Item id="departure" label="Fotografía Llegada" className="rounded-full" renderContent={<ArrivePictures />} />}
                    <ButtonsNavigation.Item id="signature" label="Firmas" className="rounded-full" renderContent={<Signatures />} />
                </ButtonsNavigation>
            </div>
        </DetailsPanelLayout>

    );
}
export default RegistDetails;


