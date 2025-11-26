
import useQuery from "@/app/hooks/useQuery/useQuery";
import { useEffect, useState } from "react";

const useAccesRequest =()=>{
    const [canAcces,setCanAcces]=useState(false);
    const{all} = useQuery();
    const idAcces = all?.idAcces;
    const enterpriseId = all?.enterpriseId;
    useEffect(()=>{
        if(idAcces && enterpriseId){
            setCanAcces(true);
        }
    },[idAcces,enterpriseId]);

    return {canAcces};
}
export default useAccesRequest;