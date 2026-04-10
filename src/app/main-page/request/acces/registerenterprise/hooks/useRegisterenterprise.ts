import { useEnterprisesStore } from "@/app/stores/useEnterprisesStore/useEnterprisesStore";
import { FieldModel } from "@/app/components/DynamicForm/types";
import { useEffect, useRef, useState } from "react";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { shallow } from "zustand/shallow";
const useRegisterEnterprise = () => {
    const submitRef = useRef<() => void | Promise<void>>(null);
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert;
    const [formCompleted, setFormCompleted] = useState(false);
    const { resetFlgs, createExternal, createInteral, creating, error, succesCreate } = useEnterprisesStore((s) => ({
        createExternal: s.createExternalEnterprise,
        createInteral: s.createEnterprise,
        resetFlgs: s.resetFlags,
        creating: s.creating,
        error: s.error,
        succesCreate: s.successPost
    }), shallow);
    const model: FieldModel[] = [
        {
            type: "input",
            value: "",
            name: "name",
            label: "Nombre de la empresa",
            validations: [{ type: "required" }]
        },
        {
            type: "input",
            value: "",
            name: "companytype",
            label: "Tipo de empresa",
            validations: [{ type: "required" }]
        },
        {
            type: "input",
            value: "",
            name: "rfc",
            label: "RFC",
            validations: [{ type: "required" }]
        },
        {
            type: "input",
            value: "",
            name: "businessindustry",
            label: "Giro empresarial",
            validations: [{ type: "required" }]
        },
        {
            type: "checkbox",
            value: "false",
            name: "external",
            label: "Empresa externa"
        }
    ]
    const handleSubmit = (values: Record<string, any>) => {
        const Payload = {
            name: values.name,
            companytype: values.companytype,
            rfc: values.rfc,
            businessindustry: values.businessindustry,
        }
        if (values.external) {
            createExternal({
                newEnterprise: values.name,
                RFC: values.rfc,
            })
            return;
        }
        createInteral(Payload);

    }
    useEffect(() => {
        if (creating) {
            showSpinner(({ message: "Creando Empresa" }))
            return;
        }

        if (succesCreate) {
            showAlert({
                type: "success",
                title: "Empresa creada",
                description: "Se creo la empresa con éxito",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
            hideSpinner();
            resetFlgs();
        }

        if (error) {
            showAlert({
                type: "error",
                title: "Error",
                description: String(error) || "Hubo un problema desconocido",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
            hideSpinner();
            resetFlgs();
        }

    }, [
        creating,
        succesCreate,
        error
    ])



    const handleValidChange = (valid: boolean) => {
        setFormCompleted(valid);
    }

    return ({ submitRef, model, handleSubmit, formCompleted, handleValidChange })
}
export default useRegisterEnterprise;
