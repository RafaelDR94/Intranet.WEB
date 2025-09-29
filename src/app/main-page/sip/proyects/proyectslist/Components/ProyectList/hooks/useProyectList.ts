'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";

import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { Proyect } from "@/app/mappings/proyects/proyects.types";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import useProyectLocationStore from "@/app/stores/useProyectLocationStore/useProyectLocationStore";
import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery';
/**
 * Hook contenedor del listado de proyectos.
 *
 * Orquesta la comunicacion con el store de proyectos, maneja feedback
 * visual mediante el PrincipalContext y expone handlers de navegacion y
 * eliminacion para la vista ProyectList.
 */
const useProyectList = () => {

    const router = useRouter();

    const isMobile = useIsMobile();

    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();

    const { showAlert, hideAlert } = usePrincipalAlert;

    const { showSpinner, hideSpinner } = usePrincipalLoading;

    const { currentPagePermissions } = useAuth();

    const { reset } = useProyectLocationStore();

    const { resetReports } = useReportsStore((s) => ({
        resetReports: s.reset
    }), shallow);

    const { resetFlags, error, loading, proyects, fetchProyects, setCurrentProyect, deleteProyect, removing, successDelete } = useProyectsStore(

        (s) => ({

            proyects: s.proyects,

            fetchProyects: s.fetchProyects,

            setCurrentProyect: s.setCurrentProyect,

            deleteProyect: s.deleteProyect,

            removing: s.removing,

            successDelete: s.successDelete,

            loading: s.loading,

            error: s.error,

            resetFlags: s.resetFlags

        }),

        shallow

    );

    const [openDelete, setOpenDelete] = useState(false);

    const [toRemove, setToRemove] = useState<Proyect | null>(null);





    useEffect(() => { fetchProyects(); }, [fetchProyects]);

    useEffect(() => {

        if (loading || removing) { showSpinner({ message: "Cargando proyectos" }); setOpenDelete(false); return; }

        hideSpinner();

        if (error) {

            setOpenDelete(false);

            showAlert({

                type: 'error',

                variant: 'filled',

                title: 'Proyecto Eliminado',

                description: error || "Error al eliminar el proyect",

                autoCloseMs: 1500,

                showPrimaryButton: false,

                showSecondaryButton: false,

                onClose: hideAlert,

            });

        }

        if (successDelete) {

            setOpenDelete(false);

            showAlert({

                type: 'warning',

                variant: 'filled',

                title: 'Proyecto Eliminado',

                description: `Se eliminó exitosamente el proyecto ${toRemove?.name ?? ''}`,

                autoCloseMs: 1500,

                showPrimaryButton: false,

                showSecondaryButton: false,

                onClose: hideAlert,

            });

        }

        resetFlags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [successDelete, showAlert, hideAlert, toRemove, loading, removing, showSpinner, setOpenDelete]);

    const handleNew = () => router.push('/main-page/sip/proyects/newproyect');

    const handleEdit = (p: Proyect) => {

        setCurrentProyect(p);

        router.push(`/main-page/sip/proyects/newproyect?id=${p.id}`);

    };

    const handleView = (p: Proyect) => {
        
        resetReports();
        reset();
        setCurrentProyect(p);
        router.push(`/main-page/sip/proyects/proyectslist?id=${p.id}&label=${p.proyectKey}`);

    };

    const handeReport = (p: Proyect) => {
        reset();
        reset();
        setCurrentProyect(p);
        router.push(`/main-page/sip/proyects/proyectslist?id=${p.id}&label=${p.proyectKey}&newReport=true`);
    }

    const handleAskDelete = (p: Proyect) => { setToRemove(p); setOpenDelete(true); };

    const handleConfirmDelete = async () => { if (toRemove) await deleteProyect(toRemove.id); };

    return {

        proyects,

        openDelete,

        setOpenDelete,

        handleView,

        handleEdit,

        handleNew,

        handleAskDelete,

        handeReport,

        handleConfirmDelete,

        toRemove,

        removing,

        currentPagePermissions,

        isMobile
    };

};

export default useProyectList;
