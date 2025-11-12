import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { FieldModel } from "@/app/components/DynamicForm/types";
import { useEffect, useRef, useState } from "react";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";

import { useEnterprisesStore } from "@/app/stores/useEnterprisesStore/useEnterprisesStore";

import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import { shallow } from "zustand/shallow";
import useProyectLocationStore from "@/app/stores/useProyectLocationStore/useProyectLocationStore";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import type { AccesPost } from "@/app/mappings/accesrequest/accesrequest.types";
import { useRouter } from "next/navigation";
const formId = "GenerateAcces";
const useGenerateAccesForm = () => {
    const router = useRouter();
    const hasInitFields = useRef(false);
    const submitRef = useRef<() => void | Promise<void>>(null);
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert;
    const [loadingForm, setLoadingForm] = useState(false);
    const [externalEnterprises, setExternalEnterprises] = useState(true);
    const hasaskedProyectsList = useRef(false);
    const hasUpdateList = useRef(false);
    const hasaskedEnterprisesList = useRef(false);
    const { fieldsByFormId, setFields, resetFields, updateField } = useFormFieldsStore();
    const [canStart, setCanStart] = useState(false);
    const [formCompleted, setFormCompleted] = useState(false);
    const { all } = useQuery();
    const idEnterprise = all.idEnterprise
    const idProyect = all.idProyect
    const idLocation = all.idLocation
    const { fetchEnterprises, resetEnterprisesFlags, enterprisesList, errorEnterprises } = useEnterprisesStore((s) => ({
        fetchEnterprises: s.fetchEnterprises,
        enterprisesList: s.enterprises,
        errorEnterprises: s.error,
        resetEnterprisesFlags: s.resetFlags
    }), shallow);


    const { fetchLocations, restLocationFlags, locationsError } = useProyectLocationStore((s) => ({
        fetchLocations: s.fetchLocations,
        locations: s.locations,
        locationsError: s.error,
        restLocationFlags: s.resetFlags
    }), shallow);

    const { fetchProyects, restProyectFlags, proyects, proyyectsError } = useProyectsStore((s) => ({
        fetchProyects: s.fetchProyects,
        proyects: s.proyects,
        proyyectsError: s.error,
        restProyectFlags: s.resetFlags
    }), shallow);

    // AccesRequirement store
    const {
        createAccesRequirement,
        creating: creatingAccess,
        error: accessError,
        successPost: successCreateAccess,
        resetFlags: resetAccessFlags,
    } = useAccesRequirementStore((s) => ({
        createAccesRequirement: s.createAccesRequirement,
        creating: s.creating,
        error: s.error,
        successPost: s.successPost,
        resetFlags: s.resetFlags,
    }), shallow);

    useEffect(() => {
        if (proyyectsError) {
            showAlert({
                type: "warning",
                title: "No logró cargar ninguna empresa",
                description: proyyectsError,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1800,
            });
            restProyectFlags();
        }
        if (locationsError) {
            showAlert({
                type: "warning",
                title: "No logró cargar ninguna ubicación",
                description: locationsError,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1800,
            });
            restLocationFlags();
        }

        if (errorEnterprises) {
            showAlert({
                type: "warning",
                title: "No logró cargar ninguna empresa",
                description: errorEnterprises,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1800,
            });
            resetEnterprisesFlags();
        }

    }, [proyyectsError, locationsError])


    const ChangeToExternal: NonNullable<FieldModel["onChange"]> = (value) => {
        setExternalEnterprises(value)
        const finalEnterpriseList = enterprisesList.filter(enterprise => enterprise.is_external == value)
        updateField(formId, 'enteprise', {
            options: finalEnterpriseList.map((enterprise) => ({ label: enterprise.name, value: enterprise.enterprise_id })),
            value: idEnterprise ? String(idEnterprise) : "", // reset value
            disabled: false,

        });
    }
    const loadInitialFields = () => {
        if (hasInitFields.current) return;
        const initialFields: () => FieldModel[] = () => {
            const model: FieldModel[] = [
                {
                    type: "toggle",
                    name: "externalEnterprise",
                    label: "Activa esta casilla, si la empresa es externa a la familia DR Security",
                    value: "false",
                    showIf: () => false,
                },
                {
                    type: "select",
                    name: "enteprise",
                    label: "Empresa Solicitante",
                    placeholder: "Selecciona una empresa",
                    options: [],
                    value: "",
                    validations: [{ type: "required" }],
                },
                {
                    type: "select",
                    name: "proyect",
                    label: "Proyecto",
                    placeholder: "Selecciona un proyecto",
                    options: [],
                    value: "",
                    validations: [{ type: "required" }],
                },
                {
                    type: "select",
                    name: "location",
                    label: "Lugar a visitar",
                    placeholder: "Selecciona una ubicación",
                    options: [],
                    value: "",
                    validations: [{ type: "required" }],
                    showIf: () => false,
                },

                {
                    type: "input",
                    name: "location_responsible",
                    label: "Responsable de ubicación",
                    value: "",
                    validations: [{ type: "required" }],
                },
                {
                    type: "input",
                    name: "location_workposition",
                    label: "Posicion de trabajo de responsable",
                    value: "",
                    validations: [{ type: "required" }],
                },

                {
                    type: "date",
                    name: "start_date",
                    label: "Fecha  de inicio",
                    value: currentDate(),
                    validations: [{ type: "required" }],
                },
                {
                    type: "date",
                    name: "end_date",
                    label: "Fecha de término",
                    value: currentDate(),
                    validations: [{ type: "required" }],

                },
                {
                    type: "textarea",
                    name: "motive",
                    label: "Motivo de la visita",
                    value: "",
                    validations: [{ type: "required" }],
                },
            ]
            return (model);
        }
        setFields(formId, initialFields());
        hasInitFields.current = true;
    }

    const handleSubmit = async (values: Record<string, any>) => {
        try {
            const payload: AccesPost = {
                id_location: values?.location ,
                id_external_enterprise: values?.enteprise,
                location_responsible: values?.location_responsible ?? "",
                location_workposition: values?.location_workposition ?? "",
                vehicles: [],
                internalpersons: [],
                externalpersons: [],
                tools: "",
                motive: values?.motive,
                start_date: values?.start_date ,
                end_date: values?.end_date,
                dr_responsiblename: "Roman de Jesús Rodriguez Granados",
                dr_responsiblesignature: "https://firebasestorage.googleapis.com/v0/b/intranetdr-50f9e.appspot.com/o/Employees%2F10004%2Fsignature2025-05-22?alt=media&token=42c11137-885a-4333-b9be-46a34683fe18",
            };
            await createAccesRequirement(payload);
        } catch (err) {
            const description = err instanceof Error ? err.message : "Error al preparar el envío.";
            showAlert({
                type: "error",
                title: "No se pudo enviar",
                description,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 2000,
            });
        }
    }

    const handleValidChange = (valid: boolean) => {
        setFormCompleted(valid);
    }

    useEffect(() => {
        resetFields(formId);
        setCanStart(true);
    }, [resetFields])

    // Efecto de spinner + alerts en base a flags del store
    useEffect(() => {
        if (creatingAccess) {
            showSpinner({ message: "Creando acceso..." });
            return;
        }
        hideSpinner();

        if (accessError) {
            showAlert({
                type: "error",
                title: "Ocurrió un error",
                description: accessError,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1800,
            });
        }

        if (successCreateAccess) {
            showAlert({
                type: "success",
                title: "Acceso creado",
                description: "Se registró el requerimiento de acceso.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1400,
            });
            router.push('/main-page/request/acces/acceshistory/');
        }

        resetAccessFlags();
    }, [creatingAccess, accessError, successCreateAccess, showSpinner, hideSpinner, showAlert, resetAccessFlags])


    const completeSelect = async (idEnterprise: string) => {
        setLoadingForm(true);
        const locations = await fetchLocations(idEnterprise, true);
        if (locations) {
            if (locations.length == 0) showAlert({
                type: "warning",
                title: "El proyecto no tiene ubicaciones",
                description: "Verifica que el proyecto tenga ubicaciones asociadas",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
            updateField(formId, 'location', {
                options: locations.map((location) => ({ label: location.name, value: location.id })),
                value: idLocation ? String(idLocation) : "",// reset value
                disabled: false,
                showIf: () => true,
                placeholder: locations.length == 0 ? "El proyecto no tiene ubicaciones asociadas." : "Selecciona una ubicación"
            });
            setLoadingForm(false);
        }


    }

    useEffect(() => {
        if (canStart) {
            loadInitialFields();
            if (enterprisesList.length == 0 && !hasaskedEnterprisesList.current) {
                hasaskedEnterprisesList.current = true
                setLoadingForm(true);
                fetchEnterprises();
            }
            if (proyects.length == 0 && !hasaskedProyectsList.current) {
                hasaskedProyectsList.current = true
                setLoadingForm(true);
                fetchProyects();

            }
            if (proyects.length > 0 && enterprisesList.length > 0 && !hasUpdateList.current) {
                const finalEnterpriseList = enterprisesList.filter(enterprise => enterprise.is_external == externalEnterprises)

                hasUpdateList.current = true
                setLoadingForm(false);
                updateField(formId, 'proyect', {
                    options: proyects.map((proyects) => ({ label: proyects.proyectKey, value: proyects.id })),
                    value: idProyect ? String(idProyect) : "", // reset value
                    disabled: false,
                    onChange: async (value: string) => {
                        completeSelect(value)
                    }
                });
                updateField(formId, 'enteprise', {
                    options: finalEnterpriseList.map((enterprise) => ({ label: enterprise.name, value: enterprise.enterprise_id })),
                    value: idEnterprise ? String(idEnterprise) : "", // reset value
                    disabled: false,

                });
                updateField(formId, 'externalEnterprise', {
                    showIf: () => true,
                    onChange: ChangeToExternal
                });

            }
        }


    }, [proyects, enterprisesList, fetchEnterprises, setLoadingForm, canStart])

    return ({
        fields: fieldsByFormId[formId] ?? [],
        submitRef,
        handleSubmit,
        formCompleted,
        handleValidChange,
        canStart,
        loadingForm
    })
}
export default useGenerateAccesForm;
