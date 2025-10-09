import React from "react";
import { Button } from "@/app/components/Button/Button"
import SignatureComponent from "@/app/components/SignatureComponent/SignatureComponent"
import { useIsMobile } from "@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery"
import SignatureBox from "@/app/components/SignatureBox/SignatureBox"
import useSignature from "./hooks/useSignatures"
import clsx from "clsx"
const Signatures = ({ isSaveValid }: { isSaveValid: boolean }) => {
    const { openSignaturePopUp,
        openClientSignaturePopUp,
        clientSignature,
        userSignature,
        user,
        handleAuthorization,
        handleClientAuthorization,
        handleClick,
        setOpenSignaturePopUp,
        setOpenClientSignaturePopUp
    } = useSignature();
    const isMobile = useIsMobile();
    return (<div >
        {!openSignaturePopUp && !openClientSignaturePopUp && <div className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
            {userSignature && <SignatureBox title={user?.fullName || ""} imageUrl={userSignature} />}
            {clientSignature && <SignatureBox title={clientSignature?.external?.name || ""} imageUrl={clientSignature?.signature || ""} captionBottom={clientSignature?.external?.workposition || ""} />}
            {!clientSignature && ((isSaveValid && userSignature) || !userSignature) && <div className={clsx("flex justify-center items-center h-full ",!isMobile && "m-20")}>

                <Button onClick={() => handleClick()} hideIcon className={clsx(isMobile&& "m-10")}>
                    {!userSignature ? "Click para firmar" : "Click para firma del cliente"}
                </Button >
            </div>}

        </div>}


        <SignatureComponent open={openSignaturePopUp} onClose={() => setOpenSignaturePopUp(false)} onAuthorization={handleAuthorization} responsibleGuid={user?.idEmployee || ""} />
        <SignatureComponent open={openClientSignaturePopUp} onClose={() => setOpenClientSignaturePopUp(false)} onAuthorization={handleClientAuthorization} responsibleGuid={""} externalSignature />

    </div>)
}
export default Signatures
