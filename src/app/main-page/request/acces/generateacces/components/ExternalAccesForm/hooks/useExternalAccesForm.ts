import useAccessRequestStore from "@/app/stores/useAccesRequestStore/useAccesRequestStore";
import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useEffect, useRef, useState } from "react";
import { shallow } from "zustand/shallow";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { AccesPut } from "@/app/mappings/accesrequest/accesrequest.types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import useStatusStore from "@/app/stores/useStatusStore/useStatusStore";

const useExternalAccesForm = () => {
    
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const hasAskedforStatuses = useRef(false);
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert
    const { all } = useQuery();
    const idAcces = all.idAcces;
    const mode = all.mode;
    const force = all.force;
    const [canUpdateForm, setCanUpdateForm,] = useState(false);
    const { fetchStatusesByType, statusList } = useStatusStore((s) => ({
        fetchStatusesByType: s.fetchStatusesByType,
        statusList: s.statuses
    }), shallow);

    const { loading, resetFlags, succesUpdate, updating, error, updateAccesRequirement, fetchAccesRequirementById, currentAcces } = useAccesRequirementStore((s) => ({
        updateAccesRequirement: s.updateAccesRequirement,
        fetchAccesRequirementById: s.fetchAccesRequirementById,
        currentAcces: s.current,
        error: s.error,
        updating: s.updating,
        succesUpdate: s.successPut,
        loading: s.loadingById,
        resetFlags: s.resetFlags
    }), shallow);
    const { vehicles,externalpersons, setExternalPersons, setVehicles,tools, setTools } = useAccessRequestStore((s) => ({
        externalpersons: s.externalpersons,
        setExternalPersons: s.setExternalPersons,
        setVehicles:s.setVehicles,
        tools: s.tools,
        vehicles:s.vehicles,
        setTools: s.setTools
    }), shallow);
    const hasInitializedAccesData = useRef(false);
    const previousAccesId = useRef<string | null>(null);
    const previousExternalPersonsSnapshot = useRef<string | null>(null);
    const previousToolsSnapshot = useRef<string | null>(null);
    const previousVehiclesSnapshot = useRef<string | null>(null);

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
            resetFlags();
        }
        hideSpinner();
    }, [error, updating, succesUpdate, loading])

    const UpdateAcces = async () => {
        if (currentAcces) {
            if (statusList.length === 0) {
                showAlert({
                    type: "error",
                    title: "No se obtuvieron status",
                    description: "No fue posible obtener los status necesarios para actualizar el acceso. Por favor, intente nuevamente más tarde.",
                    showPrimaryButton: false,
                    showSecondaryButton: false,
                    autoCloseMs: 1500,
                });
                return;
            }

            const StatusId = statusList.find(s => s.name === currentAcces?.status)?.id;
            if (!StatusId) {
                showAlert({
                    type: "error",
                    title: "Status no encontrado",
                    description: "No fue posible encontrar el status correspondiente para actualizar el acceso. Por favor, intente nuevamente más tarde.",
                    showPrimaryButton: false,
                    showSecondaryButton: false,
                    autoCloseMs: 1500,
                });
                return;
            }
            const serializedTools = JSON.stringify((tools.length ? tools : currentAcces?.tools) ?? []);

            const accesToUpdate: AccesPut = {
                id: currentAcces?.id,
                id_location: currentAcces?.location?.id,
                id_external_enterprise: currentAcces?.external_enterprise?.enterprise_id,
                location_responsible: currentAcces?.location_responsible,
                location_workposition: currentAcces?.location_workposition,
                vehicles: vehicles.map(v => v.transport_id),
                internalpersons: currentAcces?.internalpersons.map(v => v.id),
                externalpersons: externalpersons.map(v => v.id),
                tools: serializedTools,
                id_status: statusList.find(s => s.name === "Pendiente")?.id || "",
                motive: currentAcces?.motive,
                start_date: currentAcces?.start_date,
                end_date: currentAcces?.end_date,
                dr_responsiblename: currentAcces?.dr_responsiblename,
                dr_responsiblesignature: currentAcces?.dr_responsiblesignature,
                evidence_send_email: currentAcces?.evidence_send_email,
                evidence_response_email: currentAcces?.evidence_response_email,
                internal_comments: currentAcces?.internal_comments,
                external_comments: currentAcces?.external_comments
            };
            showSpinner(({ message: "Actualizando información de acceso" }));
            await updateAccesRequirement(accesToUpdate);
            await fetchAccesRequirementById(currentAcces?.id, true);
            hideSpinner();

        }


    }
    useEffect(() => {
        if (idAcces) {
            fetchAccesRequirementById(String(idAcces), true);
        }
    }, [idAcces, fetchAccesRequirementById]);
    useEffect(() => {
        if (!currentAcces) {
            setCanUpdateForm(false);
            if (hasInitializedAccesData.current) {
                setVehicles([]);
                setExternalPersons([]);
                setTools([]);
                hasInitializedAccesData.current = false;
                previousAccesId.current = null;
                previousExternalPersonsSnapshot.current = null;
                previousToolsSnapshot.current = null;
                previousVehiclesSnapshot.current = null;
            }
            return;
        }

        const isEditable = currentAcces.status === "Creada" || currentAcces.status === "I Rechazada"||!!force;
        setCanUpdateForm(isEditable);

        const currentId = currentAcces.id ?? null;
        const accesChanged = previousAccesId.current !== currentId;
        const nextExternalPersonsSnapshot = JSON.stringify(currentAcces.externalpersons ?? []);
        const nextToolsSnapshot = JSON.stringify(currentAcces.tools ?? []);
        const nextVehiclesSnapshot = JSON.stringify(currentAcces.vehicles ?? []);
        const shouldSyncExternalPersons =
            accesChanged ||
            !hasInitializedAccesData.current ||
            previousExternalPersonsSnapshot.current !== nextExternalPersonsSnapshot;
        const shouldSyncTools =
            accesChanged ||
            !hasInitializedAccesData.current ||
            previousToolsSnapshot.current !== nextToolsSnapshot;
        const shouldSyncVehicles =
            accesChanged ||
            !hasInitializedAccesData.current ||
            previousVehiclesSnapshot.current !== nextVehiclesSnapshot;

        if (shouldSyncExternalPersons) {
            if (currentAcces.externalpersons?.length) {
                setExternalPersons(currentAcces.externalpersons);
            } else {
                setExternalPersons([]);
            }
            previousExternalPersonsSnapshot.current = nextExternalPersonsSnapshot;
        }

        if (shouldSyncVehicles) {
            if (currentAcces.vehicles?.length) {
                setVehicles(currentAcces.vehicles);
            } else {
                setVehicles([]);
            }
            previousVehiclesSnapshot.current = nextVehiclesSnapshot;
        }

        if (shouldSyncTools) {
            if (currentAcces.tools?.length) {
                setTools(currentAcces.tools);
            } else {
                setTools([]);
            }
            previousToolsSnapshot.current = nextToolsSnapshot;
        }

        if (!hasInitializedAccesData.current || accesChanged) {
            previousAccesId.current = currentId;
            hasInitializedAccesData.current = true;
        }
    }, [currentAcces, setExternalPersons, setTools, setVehicles]);
    useEffect(() => {
        if (statusList.length === 0 && !hasAskedforStatuses.current) {
            fetchStatusesByType("CustomsAccess");
            hasAskedforStatuses.current = true;
        }
    }, [fetchStatusesByType, statusList]);

    const canSubmit = externalpersons.length > 0 || tools.length > 0;

    return ({
        canSubmit,
        UpdateAcces,
        currentAcces,
        canUpdateForm,
        tools,
        mode
    })
}
export default useExternalAccesForm;
