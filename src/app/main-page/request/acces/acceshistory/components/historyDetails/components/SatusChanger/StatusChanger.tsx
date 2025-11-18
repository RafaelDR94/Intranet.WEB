
import useStatusChanger from "./hooks/useStatusChanger";
import { Select } from "@/app/components/Select/Select";
import { PopUp } from "@/app/components/PopUp/PopUp";
import ImageUploaderExpanded from "@/app/components/ImageUploaderExpanded/ImageUploaderExpanded";
import FileUploaderExpanded from "@/app/components/FileUploaderexpanded/FileUploaderExpanded";
import { Input } from "@/app/components/Input/Input";
import { Button } from "@/app/components/Button/Button";
import dowloadIncon from "@/assets/icons/acciones/download.svg"


const StatusChanger = () => {
    const { handleCancelEvidence,openReportIncidence,comment, currentAcces, handleDownloadZIP, currentStatus, statuses, loadingstatuses, openPopUp, handleOpenPopUp, handleClosePopUp, handleSetEvidence, changeStatus, needEvidence, canSubmitPopUp, handleCommentChange, handleReportIncidence } = useStatusChanger();
    return (
        <>
            {currentAcces?.status == "A finalizado" &&

                <>
                    <div className="flex gap-10 mb-4 ">
                        <h1>{currentAcces?.location.name}</h1>
                        {openReportIncidence && <Button hideIcon variant="ghost" onClick={handleCancelEvidence}>Cancelar</Button>}
                        <Button disabled={openReportIncidence && !comment}hideIcon variant="outline" onClick={handleReportIncidence}>{openReportIncidence ? "Enviar Incidencia" : "Reportar Incidencia"}</Button>
                    </div>
                    {openReportIncidence && <Input label="Comentario" onChange={(e) => handleCommentChange((e.target as HTMLTextAreaElement).value)} as="textarea" />}

                </>
            }
            <div className="flex gap-10 mb-4 ">


                <Select
                    disabled={loadingstatuses}
                    className="max-w-100 "
                    selected={currentStatus?.id ? [currentStatus?.id] : []}
                    onChange={(values) => handleOpenPopUp(values[0] ?? "")}
                    options={statuses.map(status => ({ value: String(status.id), label: status.name }))}
                    placeholder="Cambiar Estatus"
                />
                {currentAcces?.evidence_response_email &&
                    <Button icon={dowloadIncon} variant="outline" size="small" onClick={handleDownloadZIP}  >
                        Archivos Finalización
                    </Button>}

            </div>

            <PopUp
                open={openPopUp}
                onClose={handleClosePopUp}
                onPrimaryButtonClick={changeStatus}
                onSecondaryButtonClick={handleClosePopUp}
                showPrimaryButton={canSubmitPopUp}
                showSecondaryButton={true}
                secondaryButtonText="Cancelar"
                title="¿Seguro que deseas cambiar el estatus?"
                content={needEvidence.state ? "Sube la evidencia correspondiente al cambio de estatus" : "Describe el motivo del cambio de estatus"}
            >
                {(needEvidence.state && needEvidence.type === 'Image' || needEvidence.type === 'ImageComment') && <ImageUploaderExpanded onImage={handleSetEvidence} preview />}
                {(needEvidence.state && needEvidence.type === 'Document') && <FileUploaderExpanded onFile={handleSetEvidence} accept=".zip" label="Sube un ZIP con la evidencia de los accesos" />}
                {(!needEvidence.state || needEvidence.type === 'ImageComment') && <Input label="Comentario" onChange={(e) => handleCommentChange((e.target as HTMLTextAreaElement).value)} as="textarea" />}

            </PopUp>

        </>

    );
};
export default StatusChanger;