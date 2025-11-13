
import useStatusChanger from "./hooks/useStatusChanger";
import { Select } from "@/app/components/Select/Select";
import { PopUp } from "@/app/components/PopUp/PopUp";
import ImageUploaderExpanded from "@/app/components/ImageUploaderExpanded/ImageUploaderExpanded";
import FileUploaderExpanded from "@/app/components/FileUploaderexpanded/FileUploaderExpanded";
import { Input } from "@/app/components/Input/Input";
const StatusChanger = () => {
    const { currentStatus, statuses, loadingstatuses, openPopUp, handleOpenPopUp, handleClosePopUp, handleSetEvidence, changeStatus, needEvidence, canSubmitPopUp, handleCommentChange } = useStatusChanger();
    return (
        <>
            <Select
                disabled={loadingstatuses}
                className="max-w-160 mb-4"
                selected={currentStatus?.id ? [currentStatus?.id] : []}
                onChange={(values) => handleOpenPopUp(values[0] ?? "")}
                options={statuses.map(status => ({ value: String(status.id), label: status.name }))}
                placeholder="Cambiar Estatus"
            />
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
                {(needEvidence.state && needEvidence.type === 'Image'||needEvidence.type ==='ImageComment' ) && <ImageUploaderExpanded onImage={handleSetEvidence} preview />}
                {(needEvidence.state && needEvidence.type === 'Document') && <FileUploaderExpanded onFile={handleSetEvidence} accept=".zip" label="Sube un ZIP con la evidencia de los accesos" />}
                {(!needEvidence.state||needEvidence.type ==='ImageComment') && <Input label="Comentario"  onChange={(e) => handleCommentChange((e.target as HTMLTextAreaElement).value)}  as="textarea"/>}

            </PopUp>

        </>

    );
};
export default StatusChanger;