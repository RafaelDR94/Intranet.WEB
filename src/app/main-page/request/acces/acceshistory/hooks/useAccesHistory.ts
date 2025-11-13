import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useEffect, useState, useRef } from "react";
import { shallow } from "zustand/shallow";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useRouter } from "next/navigation";
import { AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";

const useAccesHistory = () => {
    const hasAskedforHistory = useRef(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [openConfirmPopUp, setOpenConfirmPopUp] = useState(false);
    const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert
    const router = useRouter();
    const { resetflags, fetchreq, accesreq, loading, error, deleteAccesRequirement, deleting, succesDelete, current, setCurrent } = useAccesRequirementStore((s) => ({
        fetchreq: s.fetchAccesRequirements,
        deleteAccesRequirement: s.deleteAccesRequirement,
        deleting: s.deleting,
        accesreq: s.accesRequirements,
        loading: s.loading,
        error: s.error,
        succesGet: s.successGet,
        succesDelete: s.successDelete,
        current: s.current,
        resetflags: s.resetFlags,
        setCurrent: s.setCurrent,
    }), shallow)

    useEffect(() => {
        if (accesreq.length == 0 && !hasAskedforHistory.current) {
            hasAskedforHistory.current = true
            fetchreq(true)
        }
    }, [fetchreq, accesreq])

    const handleCreate = () => {
        router.push(`/main-page/request/acces/generateacces/`);
    }
    const handleLinkClick = async (acces: AccesRequirmentGet) => {
        const base = typeof window !== 'undefined' ? window.location.origin : '';
        const link = `${base}/accesrequest?idAcces=${acces.id}&enterpriseId=${acces.external_enterprise?.enterprise_id}`;
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(link);
            }
        } catch { /* ignore copy errors */ }
        showAlert({
            type: "success",
            title: "Link copiado",
            description: `${link} \nCopiado al portapapeles`,
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 1000,
        });
    }
    const handleAddPerson = (acces: AccesRequirmentGet) => {
        router.push(`/main-page/request/acces/generateacces/?idAcces=` + acces.id);
    }
    const handleDelete = () => {
        if (current) deleteAccesRequirement(current.id);
        else showAlert({
            type: "warning",
            title: "Error al eliminar",
            description: "No se ha seleccionado ninguna solicitud para eliminar.",
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 1500,
        });
        setCurrent(undefined)
    }
    const handleOpenDetails = (acces: AccesRequirmentGet) => {
        setOpenDetails(true);
        setCurrent(acces)
    }
    const handleCloseDetails = () => {
        setOpenDetails(false);
        setCurrent(undefined)
    }
    const handleOpenConfirmPopUP = (acces: AccesRequirmentGet) => {
        setCurrent(acces)
        setOpenConfirmPopUp(true);
    }
    const handleOpenClosePopUP = () => {
        setCurrent(undefined)
        setOpenConfirmPopUp(false);
    }




    useEffect(() => {
        if (loading) {
            showSpinner(({ message: "Cargando información" }))
            return;
        }
        if (deleting) {
            showSpinner(({ message: "Eliminando solicitud" }))
            return;
        }
        if (succesDelete) {
            showAlert({
                type: "success",
                title: "Solicitud eliminada",
                description: "La solicitud ha sido eliminada correctamente.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            resetflags();
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
            resetflags();
        }
        hideSpinner();

    }, [error, loading, deleting, succesDelete])
    return { accesreq, handleCreate, handleLinkClick, handleAddPerson, handleDelete, handleOpenDetails, handleCloseDetails, handleOpenConfirmPopUP, handleOpenClosePopUP, openDetails, openConfirmPopUp }
}
export default useAccesHistory;
