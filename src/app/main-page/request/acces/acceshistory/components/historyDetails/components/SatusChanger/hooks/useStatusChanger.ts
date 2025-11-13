
import useStatusStore from "@/app/stores/useStatusStore/useStatusStore";
import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useEffect, useRef, useState } from "react";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { shallow } from "zustand/shallow";
import { AccesPut } from "@/app/mappings/accesrequest/accesrequest.types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";


const useStatusChanger = () => {

    const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const [openPopUp, setOpenPopUp] = useState(false);
    const [canSubmitPopUp, setCanSubmitPopUp] = useState(false);
    const [needEvidence, setNeedEvidence] = useState<{ state: boolean, type: 'Image' | 'Document' | 'ImageComment' }>({ state: false, type: 'Image' });
    const [evidence, setEvidence] = useState<File | null>(null);
    const [comment, setComment] = useState<string | null>(null);
    const { showAlert } = usePrincipalAlert;
    const { firebasestorage } = useFirebase();
    const { loading, resetFlags, succesUpdate, updating, error, updateAccesRequirement, fetchAccesRequirementById, currentAcces, fetchAccesRequirements, updateExternalComments, updateInternalComments } = useAccesRequirementStore((s) => ({
        updateAccesRequirement: s.updateAccesRequirement,
        fetchAccesRequirementById: s.fetchAccesRequirementById,
        fetchAccesRequirements: s.fetchAccesRequirements,
        updateExternalComments: s.updateExternalComments,
        updateInternalComments: s.updateInternalComments,
        currentAcces: s.current,
        error: s.error,
        updating: s.updating,
        succesUpdate: s.successPut,
        loading: s.loadingById,
        resetFlags: s.resetFlags
    }), shallow);
    const { fetchStatusesByType, loadingstatuses, errorstatuses, statuses, resetflags, setCurrentStatus, currentStatus } = useStatusStore((s) => ({
        fetchStatusesByType: s.fetchStatusesByType,
        loadingstatuses: s.loading,
        errorstatuses: s.error,
        statuses: s.statuses,
        currentStatus: s.current,
        resetflags: s.resetFlags,
        setCurrentStatus: s.setCurrent
    }), shallow);
    const hasAskedforStatuses = useRef(false);



    const changeStatus = async () => {

        if (!currentAcces) {
            showAlert({
                type: "warning",
                title: "No se pudo cambiar el estado",
                description: "No hay acceso actual para cambiar el estado.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            return;
        }
        let sendEvidence = currentAcces?.evidence_send_email;
        let responseEvidence = currentAcces?.evidence_response_email;
        if (evidence) {
            const evidenceurl = await firebasestorage.uploadFile(evidence, `accesrequest/${currentAcces.id}/statuschange`);
            if (evidenceurl === null || evidenceurl === undefined || !evidenceurl.includes("http")) {
                showAlert({
                    type: "error",
                    title: "Error al subir evidencia",
                    description: "No fue posible subir la evidencia. Por favor, intente nuevamente más tarde.",
                    showPrimaryButton: false,
                    showSecondaryButton: false,
                    autoCloseMs: 1500,
                });
                return;
            }
            if (currentStatus?.name === "A rechazado" || currentStatus?.name === "A finalizado") {
                responseEvidence = evidenceurl;
            }
            if (currentStatus?.name === "Enviada") {
                sendEvidence = evidenceurl;
            }
        }
        if (comment) {
            let comentupdated = null;
            if (currentStatus?.name === "I Rechazada") {
                comentupdated = await updateExternalComments({
                    id: currentAcces.id,
                    external_comments: comment,
                });

            }
            else {
                comentupdated = await updateInternalComments({
                    id: currentAcces.id,
                    internal_comments: comment,
                });
            }
            if (!comentupdated) {
                showAlert({
                    type: "error",
                    title: "Error al actualizar comentario",
                    description: "No fue posible actualizar el comentario. Por favor, intente nuevamente más tarde.",
                    showPrimaryButton: false,
                    showSecondaryButton: false,
                    autoCloseMs: 1500,
                });
                return;
            }
        }
        const accesToUpdate: AccesPut = {
            id: currentAcces?.id,
            id_location: currentAcces?.location?.id,
            id_external_enterprise: currentAcces?.external_enterprise?.enterprise_id,
            location_responsible: currentAcces?.location_responsible,
            location_workposition: currentAcces?.location_workposition,
            vehicles: currentAcces?.vehicles.map(v => v.transport_id),
            internalpersons: currentAcces?.internalpersons.map(v => v.id),
            externalpersons: currentAcces?.externalpersons.map(v => v.id),
            tools: JSON.stringify(currentAcces?.tools),//Yo lo envio como string
            id_status: currentStatus?.id || "",
            motive: currentAcces?.motive,
            start_date: currentAcces?.start_date,
            end_date: currentAcces?.end_date,
            dr_responsiblename: currentAcces?.dr_responsiblename,
            dr_responsiblesignature: currentAcces?.dr_responsiblesignature,
            evidence_send_email: sendEvidence,
            evidence_response_email: responseEvidence,
        };
        showSpinner(({ message: "Actualizando información de acceso" }));
        await updateAccesRequirement(accesToUpdate);
        await fetchAccesRequirementById(currentAcces?.id, true);
        hideSpinner();
        ResetControlValues();
        fetchAccesRequirements();
    }
    const handleOpenPopUp = (statusId: string) => {
        const status = statuses.find(s => s.id === statusId);
        if (!status) return;
        setCurrentStatus(status);
        setOpenPopUp(true);
    }
    const handleClosePopUp = () => {
        setOpenPopUp(false);
        setCurrentStatus(undefined);
    }
    const handleSetEvidence = (file: File | null) => {
        setEvidence(file);
    }
    const handleCommentChange = (newComment: string) => {
        setComment(newComment);
    }
    const ResetControlValues = () => {
        setCurrentStatus(undefined);
        setEvidence(null);
        setOpenPopUp(false);
        setComment(null);
    }

    useEffect(() => {

        if (errorstatuses) {
            showAlert({
                type: "warning",
                title: "No se pudieron cargar los estados",
                description: errorstatuses,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            resetflags();
        }
        hideSpinner();

    }, [errorstatuses])


    useEffect(() => {
        if (loading) {
            showSpinner(({ message: "Cargando información de acceso" }))
            return;
        }
        if (updating) {
            showSpinner(({ message: "Actualizando información de acceso" }))
            return;
        }
        if (error) {
            showAlert({
                type: "warning",
                title: "No se encontraron reportes",
                description: error,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            ResetControlValues();
            resetFlags();
        }
        if (succesUpdate) {
            showAlert({
                type: "success",
                title: "Actualización exitosa",
                description: "La actualización se realizó correctamente.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            ResetControlValues();
            resetFlags();
        }
        hideSpinner();
    }, [error, updating, succesUpdate, loading])
    useEffect(() => {
        if (statuses.length === 0 && !hasAskedforStatuses.current) {
            fetchStatusesByType("CustomsAccess");
            hasAskedforStatuses.current = true;
        }
    }, [fetchStatusesByType, statuses]);

    useEffect(() => {
        if (currentStatus?.name === "Enviada") {
            setNeedEvidence({ state: true, type: 'Image' });
        }
        else if (currentStatus?.name === "A rechazado") {
            setNeedEvidence({ state: true, type: 'ImageComment' });
        }
        else if (currentStatus?.name === "A finalizado") {
            setNeedEvidence({ state: true, type: 'Document' });
        }
        else {
            setNeedEvidence({ state: false, type: 'Image' });
        }

    }, [currentAcces, currentStatus])
    useEffect(() => {
        if (needEvidence.state && !evidence) {
            setCanSubmitPopUp(false);
        }
        else if (needEvidence.state && evidence) {
            setCanSubmitPopUp(true);
        }
        else {
            setCanSubmitPopUp(!!comment);
        }
    }, [needEvidence, evidence,comment]);
    return { currentStatus, statuses, loadingstatuses, openPopUp, handleOpenPopUp, handleClosePopUp, changeStatus, needEvidence, handleSetEvidence, canSubmitPopUp, handleCommentChange };
}
export default useStatusChanger;
