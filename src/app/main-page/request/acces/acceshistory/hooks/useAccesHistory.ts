import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useEffect, useState, useRef } from "react";
import { shallow } from "zustand/shallow";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useRouter } from "next/navigation";
import { AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";
import useQuery from "@/app/hooks/useQuery/useQuery";
const useAccesHistory = () => {
    const { all } = useQuery();
    const idAcces = all.idAcces;
    const hasAskedforHistory = useRef(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [openConfirmPopUp, setOpenConfirmPopUp] = useState(false);
    const { usePrincipalLoading, usePrincipalAlert } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert
    const router = useRouter();
    const {  resetflags, fetchreq, accesreq, loading, error, deleteAccesRequirement, deleting, succesDelete, current, setCurrent } = useAccesRequirementStore((s) => ({
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
        if (!hasAskedforHistory.current) {
            hasAskedforHistory.current = true
            fetchreq(true)
        }
    }, [fetchreq])

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
        router.push(`/main-page/request/acces/generateacces/?idAcces=${acces.id}&enterpriseId=${acces.external_enterprise?.enterprise_id}`);
    }
    const handleDelete = () => {
        setOpenConfirmPopUp(false);
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
        router.push('/main-page/request/acces/acceshistory?idAcces=' + acces.id)
        setCurrent(acces)
    }
    const handleCloseDetails = () => {
        router.push('/main-page/request/acces/acceshistory/')
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
    const handleRenewAcces = (acces: AccesRequirmentGet) => {
        router.push(`/main-page/request/acces/generateacces/?idAcces=${acces.id}&enterpriseId=${acces.external_enterprise?.enterprise_id}&mode=renew`);
    }
    useEffect(() => {
        if (idAcces) {
            setOpenDetails(true);
        }
        else {
            setOpenDetails(false);
        }
    }, [idAcces,setOpenDetails])
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

    return { accesreq, handleRenewAcces, handleCreate, handleLinkClick, handleAddPerson, handleDelete, handleOpenDetails, handleCloseDetails, handleOpenConfirmPopUP, handleOpenClosePopUP, openDetails, openConfirmPopUp }
}
export default useAccesHistory;
