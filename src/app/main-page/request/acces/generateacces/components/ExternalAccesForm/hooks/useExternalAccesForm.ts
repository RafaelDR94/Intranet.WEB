import useAccessRequestStore from "@/app/stores/useAccesRequestStore/useAccesRequestStore";
import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useEffect,useState } from "react";
import { shallow } from "zustand/shallow";
import useQuery from "@/app/hooks/useQuery/useQuery";
// import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
const useExternalAccesForm = () => {
    const { all } = useQuery();
    const idAcces = all.idAcces;
    const [canUpdateForm,setCanUpdateForm]=useState(false);
    const {  fetchAccesRequirementById, currentAcces } = useAccesRequirementStore((s) => ({
        updateAccesRequirement: s.updateAccesRequirement,
        fetchAccesRequirementById: s.fetchAccesRequirementById,
        currentAcces: s.current
    }), shallow);
    const { externalpersons } = useAccessRequestStore((s) => ({
        externalpersons: s.externalpersons,
    }), shallow);

    const UpdateAcces = () => {
       
    }
    useEffect(() => {
        if (idAcces) {
            fetchAccesRequirementById(String(idAcces), true);
        }
    }, [idAcces, fetchAccesRequirementById]);
    useEffect(() => {
        if(currentAcces && (currentAcces.status=="Creada"||currentAcces?.status=="I Rechazada"))setCanUpdateForm(true);
    }, [currentAcces]);

    return ({
        canSubmit: externalpersons.length > 0,
        UpdateAcces,
        currentAcces,
        canUpdateForm
    })
}
export default useExternalAccesForm;
