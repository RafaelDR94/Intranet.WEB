import { shallow } from "zustand/shallow";
import { useTransportStore } from "@/app/stores/useTransportStore/useTransportStore";
import { useEffect } from "react";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";


const useRegisterDetails = () => {
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showAlert } = usePrincipalAlert;
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { currentAssignment, fetchAssignmentById, error,loadingdetails } = useTransportStore(
        (s) => ({
            loadingdetails: s.loadingVehicleTracking,
            fetchAssignmentById: s.fetchAssignmentById,
            currentAssignment: s.currentAssignment,
            error: s.error,
        }),
        shallow
    );


    useEffect(() => {
        if (!currentAssignment) return;
        if (!currentAssignment.vehicletrackinglist || currentAssignment.vehicletrackinglist.length === 0) {
            fetchAssignmentById(currentAssignment.vehicleassignments_id, true);
        }

    }, [currentAssignment, fetchAssignmentById]);

    useEffect(() => {
        if(loadingdetails){showSpinner({message:"Cargando detalles"});return;}
        if (error) {
            showAlert({
                type: 'error',
                variant: 'subtle',
                title: 'Error obteniendo detalles',
                description: error||'No se pudieron obtener los detalles del registro del vehículo.',
                autoCloseMs: 1200,
                showPrimaryButton: false,
                showSecondaryButton: false,
            });
        }
        hideSpinner();
    }, [loadingdetails,error, showAlert,hideSpinner]);
    return {
        currentAssignment
    };
}
export default useRegisterDetails;