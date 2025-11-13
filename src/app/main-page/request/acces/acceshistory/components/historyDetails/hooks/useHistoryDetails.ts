
import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useEffect} from "react";
import { shallow } from "zustand/shallow";
import useQuery from "@/app/hooks/useQuery/useQuery";


const useHistoryDetails = () => {
    const { all } = useQuery();
    const idAcces = all.idAcces;

    const {  fetchAccesRequirementById, currentAcces } = useAccesRequirementStore((s) => ({
        fetchAccesRequirementById: s.fetchAccesRequirementById,
        currentAcces: s.current,
    }), shallow);

    useEffect(() => {
        if (idAcces && !currentAcces) {
            fetchAccesRequirementById(String(idAcces));
        }
    }, [idAcces, fetchAccesRequirementById]);
   
    return { };
}
export default useHistoryDetails;
