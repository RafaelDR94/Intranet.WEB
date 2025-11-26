import { useState, useEffect, useCallback } from "react";
import { SignaturePopUpProps, Authorized, External } from "../../SignaturePopUp/types";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import { base64ToBlob } from "@/app/utilities/PicturesHelper/PictureHelper";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";

type UseSignatureComponentProps = SignaturePopUpProps & {
    skipAuthorization?: boolean;
};

const useSignatureComponent = ({ onAuthorization, onClose, open, responsibleGuid, externalSignature, skipAuthorization = false }: UseSignatureComponentProps) => {
    const { firebasestorage } = useFirebase();
    const { changeSignature, error, changingSignature, succesChangeSignature, resetFlags } = useAuthStore();
    const [openSignaturePopUp, setOpenSignaturePopUp] = useState(false);
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [externalInformation, setExternalInformation] = useState<External>({ name: "", workposition: "" });
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showAlert } = usePrincipalAlert;
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const finalClose = () => {
        setExternalInformation({ name: "", workposition: "" })
        setShowSignaturePad(false);
        setOpenSignaturePopUp(false);
        onClose();
    }
    const onPopUpClose = useCallback(() => {
        finalClose();
    }, []);
    const handleAuthorization = (authorized: Authorized) => {
        if (externalSignature && authorized?.external) setExternalInformation(authorized?.external)
        if (!authorized.state) return;
        if (authorized?.signature) { onAuthorization(authorized); finalClose(); return; }
        setShowSignaturePad(true);
        setOpenSignaturePopUp(false);

    }
    const handleSignatureSave = (signature: string) => {
        if (externalSignature) {
            onAuthorization({ state: true, signature: signature, external: externalInformation });
            finalClose();
            return;
        }
        showSpinner({ message: "Subiendo firma" });

        try {
            firebasestorage.uploadFile(base64ToBlob(signature), "Employees/" + responsibleGuid + "/signature" + currentDate()).then(img => {
                const SignaturePayload = {
                    "idemployee": responsibleGuid,
                    "signature": img
                };
                changeSignature(SignaturePayload)
                onAuthorization({ state: true, signature: img });

            })
        }
        catch (error) {
         
            showAlert({
                type: "info",
                title: "No se actualizo la firma",
                description: String(error),
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            hideSpinner();
        }
    }
    const handleCancel = () => {
        setShowSignaturePad(false);
        finalClose();
    }
    useEffect(() => {
        if (!open) {
            setOpenSignaturePopUp(false);
            setShowSignaturePad(false);
            return;
        }

        if (skipAuthorization) {
            setOpenSignaturePopUp(false);
            setShowSignaturePad(true);
            return;
        }

        setOpenSignaturePopUp(true);
    }, [open, skipAuthorization])

    useEffect(() => {
        if (changingSignature) return;
        if (error) {
            showAlert({
                type: "info",
                title: "No se actualizo la firma",
                description: error,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            finalClose();
            resetFlags();
            hideSpinner();
        }
        if (succesChangeSignature) {
            showAlert({
                type: "info",
                title: "Firma actualizada correctamente",
                description: "Se ha actualizo su firma correctamente.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });

            finalClose();
            resetFlags();
            hideSpinner();
        }

    }, [changingSignature, succesChangeSignature, error, finalClose, resetFlags, hideSpinner, showAlert, onAuthorization])
    return { externalInformation, openSignaturePopUp, showSignaturePad, handleAuthorization, handleSignatureSave, handleCancel, onPopUpClose }
}
export default useSignatureComponent;