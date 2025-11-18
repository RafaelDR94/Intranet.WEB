import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { FieldModel } from "@/app/components/DynamicForm/types";
import { useEffect, useRef, useState } from "react";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { currentDate } from "@/app/utilities/DatesHelper/Dateshelper";
import useStatusStore from "@/app/stores/useStatusStore/useStatusStore";
import { useEnterprisesStore } from "@/app/stores/useEnterprisesStore/useEnterprisesStore";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { useProyectsStore } from "@/app/stores/useProyectsStore/useProyectsStore";
import { shallow } from "zustand/shallow";
import useProyectLocationStore from "@/app/stores/useProyectLocationStore/useProyectLocationStore";
import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import type { AccesPost } from "@/app/mappings/accesrequest/accesrequest.types";
import { useRouter } from "next/navigation";
import { AccesPut } from "@/app/mappings/accesrequest/accesrequest.types";
const formId = "GenerateAcces";
const useGenerateAccesForm = () => {
    const { all } = useQuery();
    const idAcces = all.idAcces;
    const mode = all.mode;
    const router = useRouter();

    const lastAddAccesValue = useRef<string | boolean>(null);
    const submitRef = useRef<() => void | Promise<void>>(null);
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert;
    const [loadingForm, setLoadingForm] = useState(false);
    const [externalEnterprises, setExternalEnterprises] = useState(true);
    const hasInitFields = useRef(false);
    const hasaskedProyectsList = useRef(false);
    const hasUpdateList = useRef(false);
    const hasAskedforStatuses = useRef(false);
    const hasaskedEnterprisesList = useRef(false);
    const { fieldsByFormId, setFields, resetFields, updateField } = useFormFieldsStore();
    const [canStart, setCanStart] = useState(false);
    const [formCompleted, setFormCompleted] = useState(false);
    const { fetchStatusesByType, statusList } = useStatusStore((s) => ({
        fetchStatusesByType: s.fetchStatusesByType,
        statusList: s.statuses
    }), shallow);
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
        updateAccesRequirement,
        creating: creatingAccess,
        error: accessError,
        successPost: successCreateAccess,
        updating: updatingAcces,
        succesPut: succesUpdateAcces,
        resetFlags: resetAccessFlags,
        current,
        loadingCurrent,
        setcurrent,
        fetchAccesRequirementById
    } = useAccesRequirementStore((s) => ({
        createAccesRequirement: s.createAccesRequirement,
        updateAccesRequirement: s.updateAccesRequirement,
        creating: s.creating,
        error: s.error,
        successPost: s.successPost,
        resetFlags: s.resetFlags,
        current: s.current,
        setcurrent: s.setCurrent,
        fetchAccesRequirementById: s.fetchAccesRequirementById,
        loadingCurrent: s.loadingById,
        succesPut: s.successPut,
        updating: s.updating,
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
            value: current?.external_enterprise?.enterprise_id ?? true,
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
                    value: current?.external_enterprise?.is_external ?? true,
                    showIf: () => false,
                    disabled: !!current
                },
                {
                    type: "select",
                    name: "enteprise",
                    label: "Empresa Solicitante",
                    placeholder: "Selecciona una empresa",
                    options: [],
                    value: current?.external_enterprise?.enterprise_id ?? "",
                    onlyText: !!current,
                    validations: [{ type: "required" }],
                },
                {
                    type: "select",
                    name: "proyect",
                    label: "Proyecto",
                    placeholder: "Selecciona un proyecto",
                    options: [],
                    value: current?.location?.proyect[0]?.id ?? "",
                    onlyText: !!current,
                    validations: [{ type: "required" }],
                },
                {
                    type: "select",
                    name: "location",
                    label: "Lugar a visitar",
                    placeholder: "Selecciona una ubicación",
                    options: current ? [{ value: current?.location?.id, label: current?.location?.name }] : [],
                    value: current?.location?.id ?? "",
                    validations: [{ type: "required" }],
                    onlyText: !!current,
                    showIf: () => !!current,
                },

                {
                    type: "input",
                    name: "location_responsible",
                    label: "Responsable de ubicación",
                    value: current?.location_responsible ?? "",
                    validations: [{ type: "required" }],
                },
                {
                    type: "input",
                    name: "location_workposition",
                    label: "Posicion de trabajo de responsable",
                    value: current?.location_workposition ?? "",
                    validations: [{ type: "required" }],
                },

                {
                    type: "date",
                    name: "start_date",
                    label: "Fecha  de inicio",
                    value: current?.start_date ?? currentDate(),
                    validations: [{ type: "required" }],
                },
                {
                    type: "date",
                    name: "end_date",
                    label: "Fecha de término",
                    value: current?.end_date ?? currentDate(),
                    validations: [{ type: "required" }],

                },
                {
                    type: "textarea",
                    name: "motive",
                    label: "Motivo de la visita",
                    value: current?.motive ?? "",
                    validations: [{ type: "required" }],
                },
            ]
            return (model);
        }
        setFields(formId, initialFields());
        hasInitFields.current = true;
    }

    const handleSubmit = async (values: Record<string, any>) => {
        console.log("Esto solo se ejecuta una vez");
        try {
            if (String(mode) == "renew" && current) {
                const payload: AccesPost = {
                    id_location: values?.location,
                    id_external_enterprise: values?.enteprise,
                    location_responsible: values?.location_responsible ?? "",
                    location_workposition: values?.location_workposition ?? "",
                    vehicles: [],
                    internalpersons: [],
                    externalpersons: [],
                    tools: "",
                    motive: values?.motive,
                    start_date: values?.start_date,
                    end_date: values?.end_date,
                    dr_responsiblename: "Roman de Jesús Rodriguez Granados",
                    dr_responsiblesignature: "https://firebasestorage.googleapis.com/v0/b/intranetdr-50f9e.appspot.com/o/Employees%2F10004%2Fsignature2025-05-22?alt=media&token=42c11137-885a-4333-b9be-46a34683fe18",
                };
                console.log("Creando", payload);
                const newacces = await createAccesRequirement(payload);
                if (newacces) {

                    const StatusId = statusList.find(s => s.name === newacces?.status)?.id;
                    const accesToUpdate: AccesPut = {
                        id: newacces?.id,
                        id_location: current?.location?.id,
                        id_external_enterprise: current?.external_enterprise?.enterprise_id,
                        location_responsible: newacces?.location_responsible ?? "",
                        location_workposition: newacces?.location_workposition ?? "",
                        vehicles: current?.vehicles.map(v => v.transport_id),
                        internalpersons: current?.internalpersons.map(v => v.id),
                        externalpersons: current?.externalpersons.map(v => v.id),
                        tools: JSON.stringify(current.tools),//Yo lo envio como string
                        id_status: StatusId || "",
                        motive: newacces?.motive,
                        start_date: newacces?.start_date,
                        end_date: newacces?.end_date,
                        dr_responsiblename: current?.dr_responsiblename,
                        dr_responsiblesignature: current?.dr_responsiblesignature,
                        evidence_send_email: newacces?.evidence_send_email,
                        evidence_response_email: newacces?.evidence_response_email,
                        internal_comments: newacces?.internal_comments,
                        external_comments: newacces?.external_comments
                    };
                    console.log("Actualizando", accesToUpdate);
                    await updateAccesRequirement(accesToUpdate);
                }

            }

            else if (String(mode) == "edit" && current) {

                const StatusId = statusList.find(s => s.name === current?.status)?.id;
                const accesToUpdate: AccesPut = {
                    id: current?.id,
                    id_location: current?.location?.id,
                    id_external_enterprise: current?.external_enterprise?.enterprise_id,
                    location_responsible: values?.location_responsible ?? "",
                    location_workposition: values?.location_workposition ?? "",
                    vehicles: current?.vehicles.map(v => v.transport_id),
                    internalpersons: current?.internalpersons.map(v => v.id),
                    externalpersons: current?.externalpersons.map(v => v.id),
                    tools: JSON.stringify(current.tools),//Yo lo envio como string
                    id_status: StatusId || "",
                    motive: values?.motive,
                    start_date: values?.start_date,
                    end_date: values?.end_date,
                    dr_responsiblename: current?.dr_responsiblename,
                    dr_responsiblesignature: current?.dr_responsiblesignature,
                    evidence_send_email: current?.evidence_send_email,
                    evidence_response_email: current?.evidence_response_email,
                    internal_comments: current?.internal_comments,
                    external_comments: current?.external_comments
                };

                await updateAccesRequirement(accesToUpdate);
            }
            else {
                const payload: AccesPost = {
                    id_location: values?.location,
                    id_external_enterprise: values?.enteprise,
                    location_responsible: values?.location_responsible ?? "",
                    location_workposition: values?.location_workposition ?? "",
                    vehicles: [],
                    internalpersons: [],
                    externalpersons: [],
                    tools: "",
                    motive: values?.motive,
                    start_date: values?.start_date,
                    end_date: values?.end_date,
                    dr_responsiblename: "Roman de Jesús Rodriguez Granados",
                    dr_responsiblesignature: "https://firebasestorage.googleapis.com/v0/b/intranetdr-50f9e.appspot.com/o/Employees%2F10004%2Fsignature2025-05-22?alt=media&token=42c11137-885a-4333-b9be-46a34683fe18",
                };
                await createAccesRequirement(payload);
            }

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

    const ManageInit = async () => {
        // Reset form and allow UI to proceed while data loads
        resetFields(formId);

        if (idAcces) {
            if (statusList.length === 0 && !hasAskedforStatuses.current) {
                await fetchStatusesByType("CustomsAccess");
                hasAskedforStatuses.current = true;
            }
            if (!current) await fetchAccesRequirementById(String(idAcces));
        }
        else {
            setcurrent(undefined)
        }

    }

    useEffect(() => {
        if (lastAddAccesValue.current === String(idAcces)) return;
        lastAddAccesValue.current = String(idAcces);
        setCanStart(false);
        hasInitFields.current = false;
        hasaskedProyectsList.current = false;
        hasUpdateList.current = false;
        hasaskedEnterprisesList.current = false;

        void (async () => {
            await ManageInit();
            setCanStart(true);
        })();
    }, [idAcces]);

    // Efecto de spinner + alerts en base a flags del store
    useEffect(() => {
        if (creatingAccess) {
            showSpinner({ message: "Creando acceso..." });
            return;
        }
        if (updatingAcces) {
            showSpinner({ message: "Actualizando acceso..." });
            return;
        }
        if (loadingCurrent) {
            showSpinner({ message: "Cargando Información de acceso..." });
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
                autoCloseMs: 1000,
            });
            router.push('/main-page/request/acces/acceshistory/');
        }
        if (succesUpdateAcces) {
            showAlert({
                type: "success",
                title: "Acceso actualizado",
                description: "Se actualizó correctamente la información del acceso.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
            router.push('/main-page/request/acces/acceshistory/');
        }

        resetAccessFlags();
    }, [succesUpdateAcces, updatingAcces, creatingAccess, accessError, successCreateAccess, loadingCurrent, showSpinner, hideSpinner, showAlert, resetAccessFlags])


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
                options: locations.map((location) => ({ label: location.name, value: location?.id })),
                disabled: false,
                showIf: () => true,
                value: current?.location?.id ?? "",
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
                    options: proyects.map((proyects) => ({ label: proyects.proyectKey, value: proyects?.id })),
                    disabled: false,
                    value: current?.location?.proyect[0]?.id ?? "",
                    onChange: async (value: string) => {
                        completeSelect(value)
                    }
                });
                updateField(formId, 'enteprise', {
                    options: finalEnterpriseList.map((enterprise) => ({ label: enterprise.name, value: enterprise.enterprise_id })),
                    disabled: false,
                    value: current?.external_enterprise?.enterprise_id ?? "",
                });
                updateField(formId, 'externalEnterprise', {
                    showIf: () => true,
                    onChange: ChangeToExternal
                });

            }
        }


    }, [proyects, enterprisesList, fetchEnterprises, setLoadingForm, canStart])

    const submitText = () => {
        if (String(mode) == "edit") {
            return ("Editar Acceso");
        }
        else if (String(mode) == "renew") {
            return ("Renovar Acceso");
        }
        else {
            return ("Registrar Acceso");
        }
    }

    const titleText = () => {
        if (String(mode) == "edit") {
            return ("Formulario de edición de acceso");
        }
        else if (String(mode) == "renew") {
            return ("Formulario de renovación de acceso");
        }
        else {
            return ("Formulario de creación de acceso");
        }
    }

    return ({
        fields: fieldsByFormId[formId] ?? [],
        submitRef,
        handleSubmit,
        formCompleted,
        handleValidChange,
        canStart,
        loadingForm,
        submitText,
        titleText
    })
}
export default useGenerateAccesForm;
