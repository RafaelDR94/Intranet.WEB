
import { FieldModel } from "../../DynamicForm/types";

import { UseSignaturePopUpProps } from "../types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useAuthStore } from "@/app/stores/useAuthStore/useAuthStore";
import { useEffect, useMemo } from "react";


const useSignaturePopUp = ({ onAuthorization, responsibleGuid, onClose, externalSignature }: UseSignaturePopUpProps) => {
    const { loading, successAuthValidate, error, signature, authValidate, resetFlags } = useAuthStore();
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showAlert } = usePrincipalAlert;
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const handleSubmit = (values: Record<string, any>) => {
        if (externalSignature) {
            onAuthorization({ state: true, signature: "",external:{name:values?.name,workposition:values?.workposition} })
            return;
        }
        showSpinner({ message: "Validando firma" })
        authValidate({ "idemployee": responsibleGuid, "password": values?.auth });
    }
    const fields: FieldModel[] = useMemo(() => {
        if (!externalSignature) return ([
            { type: 'password', name: 'auth', label: 'Autorización*', placeholder: 'Autorización', value: "", validations: [{ type: 'required' }] },

        ]);
        return [
            { type: 'input', name: 'name', label: 'Nombre*', placeholder: 'Nombre del responsable', value: "", validations: [{ type: 'required' }] },
            { type: 'input', name: 'workposition', label: 'Puesto*', placeholder: 'Puesto', value: "", validations: [{ type: 'required' }] },
        ];;
    }, [externalSignature])

    useEffect(() => {
        if (loading) return;
        if (error) {
            onAuthorization({ state: false, signature: "" })
            showAlert({
                type: "error",
                title: "No se valido correctamente",
                description: error,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            resetFlags();
            hideSpinner();

        }
        if (successAuthValidate) {
            onAuthorization({ state: true, signature: signature || "" })
            showAlert({
                type: "success",
                title: "Firma validada correctamente",
                description: "Se ha autorizado su firma correctamente.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1500,
            });
            resetFlags();
            hideSpinner();

        }

    }, [signature, error, successAuthValidate, loading, onAuthorization, showAlert, onClose])
    return ({ fields, handleSubmit })
}
export default useSignaturePopUp