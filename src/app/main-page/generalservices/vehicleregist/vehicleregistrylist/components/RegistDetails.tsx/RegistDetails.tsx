

import useRegisterDetails from "./hooks/useRegisterDetails";
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout";
import ButtonsNavigation from "@/app/components/ButtonsNavigation/ButtonsNavigation";
import Information from "./components/Information/Information";
import ArrivePictures from "./components/ArrivePictures/ArrivePictures";
import DeparturePictures from "./components/DeparturePictures/DeparturePictures";
import Signatures from "./components/Signatures/Signatures";
import PDFIcon from "@/assets/icons/Docs/page.svg";
import { Button } from "@/app/components/Button/Button";
export interface RegistDetailsProps {
    onClose: () => void;
    open: boolean;
}
const RegistDetails = ({ onClose, open }: RegistDetailsProps) => {
    const { currentAssignment, arrivalDate, hasArrival, hasDeparture, canGenerate, generatingType, generatingResponsive, handleDownloadDocument, handleDownloadResponsive } = useRegisterDetails();
    return (

        <DetailsPanelLayout onClose={onClose} open={open}
            zIndex={80}

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


