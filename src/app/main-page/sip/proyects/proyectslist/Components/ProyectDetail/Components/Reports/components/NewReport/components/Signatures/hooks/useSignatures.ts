import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import { Authorized } from "@/app/components/SignaturePopUp/types";
import useReportBuilderStore from "@/app/stores/useReportBuilderStore/useReportBuilderStore";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";
const useSignature = () => {
    const { report, updateSignature, updateClientsign } = useReportBuilderStore();
    const [openSignaturePopUp, setOpenSignaturePopUp] = useState(false);
    const [openClientSignaturePopUp, setOpenClientSignaturePopUp] = useState(false);
    const [userSignature, setUserSignature] = useState("");
    const [clientSignature, setClientSignature] = useState<Authorized | null>(null);
    const { user } = useAuth();
    const handleAuthorization = (authorized: Authorized) => {
        if (authorized?.signature) {
            setUserSignature(authorized?.signature);
            updateSignature(authorized?.signature)
        }
    }
    const handleClientAuthorization = (authorized: Authorized) => {
        if (authorized?.signature && userSignature) {
            updateClientsign({
                clientname:authorized.external?.name||"",
                clientworkposition: authorized?.external?.workposition,
                datetime: currentDate(),
                url: authorized?.signature
            })
            setClientSignature(authorized); 
        }
    }
    const handleClick = () => {
        if (userSignature) setOpenClientSignaturePopUp(true);
        else setOpenSignaturePopUp(true);
    }
    useEffect(() => {
        if (!userSignature && report?.employeesignurl) setUserSignature(report?.employeesignurl)
        if (!clientSignature && report?.clientsign?.url) setClientSignature({
            state: true, signature: report?.clientsign?.url || "", external: {
                name: report?.clientsign?.clientname || "",
                workposition: report?.clientsign?.clientworkposition || "",
            }
        })
    }, [report])

    return ({
        openSignaturePopUp,
        openClientSignaturePopUp,
        clientSignature,
        user,
        userSignature,
        handleAuthorization,
        handleClientAuthorization,
        handleClick,
        setOpenSignaturePopUp,
        setOpenClientSignaturePopUp
    })
}
export default useSignature