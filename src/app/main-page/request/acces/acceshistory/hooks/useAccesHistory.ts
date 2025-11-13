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
    const { resetflags, fetchreq, accesreq, loading, error, setCurrent, current } = useAccesRequirementStore((s) => ({
        fetchreq: s.fetchAccesRequirements,
        accesreq: s.accesRequirements,
        loading: s.loading,
        error: s.error,
        succesGet: s.successGet,
        resetflags: s.resetFlags,
        setCurrent: s.setCurrent,
        current: s.current
    }), shallow)

    useEffect(() => {
        console.log('current ', current);
        
    },[current])

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
    const handleAddPerson = (acces:AccesRequirmentGet) => {
        router.push(`/main-page/request/acces/generateacces/?idAcces=`+acces.id);
    }
    const handleDelete = () => {

    }
    const handleOpenDetails = (acces:AccesRequirmentGet) => {
        console.log('acces', acces);
        
        setOpenDetails(true);
        setCurrent(acces)
    }
    const handleCloseDetails = () => {
        setOpenDetails(false);
        setCurrent(undefined)
    }
    const handleOpenConfirmPopUP = () => {
        setOpenConfirmPopUp(true);
    }
    const handleOpenClosePopUP = () => {
        setOpenConfirmPopUp(false);
    }




    useEffect(() => {
        if (loading) {
            showSpinner(({ message: "Cargando información" }))
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

    }, [error, loading])
    return { accesreq, handleCreate, handleLinkClick, handleAddPerson, handleDelete, handleOpenDetails, handleCloseDetails, handleOpenConfirmPopUP, handleOpenClosePopUP, openDetails, openConfirmPopUp }
}
export default useAccesHistory;
