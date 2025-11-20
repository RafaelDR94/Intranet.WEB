import { useFormFieldsStore } from "@/app/stores/useFormFieldsStore/useFormFieldsStore";
import { FieldModel } from "@/app/components/DynamicForm/types";
import { useEffect, useRef, useState } from "react";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { parseIneText, IneData } from "@/app/utilities/OCR/INEParcer";
import { parseIneMrz } from "@/app/utilities/OCR/INETraseraParcer";
import { askForOCR } from "@/app/utilities/OCR/AskForOCR";
import { parseDriverLicense } from "@/app/utilities/OCR/DriverLicenseoarecer";
import { useExternalPersonsStore } from "@/app/stores/useExternalPersonsStore/useExternalPersonsStore";
import { shallow } from "zustand/shallow";
import type { ExternalPersonPost } from "@/app/mappings/externalperson/externalperson.types";
import { useFirebase } from "@/app/context/FirebaseContext/FirebaseContext";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { AddExtneralPersonFormProps } from "../types";
import useAccessRequestStore from "@/app/stores/useAccesRequestStore/useAccesRequestStore";



const useAddExternalPersonForm = ({ formId, currentexternalperson }: AddExtneralPersonFormProps) => {
    const { updateperson, addExternalPerson } = useAccessRequestStore((s) => ({
        addExternalPerson: s.addExternalPerson,
        updateperson: s.updateExternalPerson
    }), shallow);
    const hasInitFields = useRef(false);
    const { updateExternalPerson, createExternalPerson, creating, updating, succesUpdate, error, succesCreate, resetFlags } = useExternalPersonsStore((s) => ({
        createExternalPerson: s.createExternalPerson,
        updateExternalPerson: s.updateExternalPerson,
        creating: s.creating,
        updating: s.updating,
        succesUpdate: s.successPut,
        error: s.error,
        succesCreate: s.successPost,
        resetFlags: s.resetFlags,
    }), shallow)

    const { all } = useQuery();
    const currentEnterpriseId = all.enterpriseId;
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { showAlert } = usePrincipalAlert;
    const { fieldsByFormId, setFields, resetFields, updateField } = useFormFieldsStore();
    const [canStart, setCanStart] = useState(false);
    const { firebasestorage } = useFirebase();
    const [frontalIneJson, setFrontalIneJson] = useState({});
    const [backIneJson, setBackIneJson] = useState({});
    const [licenseJson, setLicenseJson] = useState({});
    const hasInitFrontINE = useRef(false);
    const hasInitBackINE = useRef(false);
    const hasInitLicense = useRef(false);

    const loadInitialFields = () => {
        if (hasInitFields.current) return;
        const initialFields: () => FieldModel[] = () => {
            const model: FieldModel[] = [
                {
                    type: "imageUploaderExpanded",
                    name: "frontal_ine_url",
                    label: "INE Frontal",
                    value: null,
                    initialFile: currentexternalperson?.frontal_ine_url
                        ? { name: "frontal_ine.jpg", url: currentexternalperson.frontal_ine_url }
                        : undefined,
                    accept: ".jpg,.jpeg,.png",
                    preview: true,
                    validations: [{ type: "required" }],
                    onChange: handleUploadINE
                },
                {
                    type: "imageUploaderExpanded",
                    name: "back_ine_url",
                    label: "INE Trasera",
                    value: null,
                    initialFile: currentexternalperson?.back_ine_url
                        ? { name: "back_ine.jpg", url: currentexternalperson.back_ine_url }
                        : undefined,
                    accept: ".jpg,.jpeg,.png",
                    preview: true,
                    validations: [{ type: "required" }],
                    onChange: handleUploadINEBack
                },
                {
                    type: "imageUploaderExpanded",
                    name: "pictureURL",
                    label: "Foto de la persona",
                    value: null,
                    initialFile: currentexternalperson?.pictureURL
                        ? { name: "pictureURL.jpg", url: currentexternalperson.pictureURL }
                        : undefined,
                    accept: ".jpg,.jpeg,.png",
                    preview: true,
                    validations: [{ type: "required" }],
                    showIf: () => !!currentexternalperson,
                },
                {
                    type: "imageUploaderExpanded",
                    name: "license_url",
                    label: "Licencia",
                    value: null,
                    initialFile: currentexternalperson?.license_url
                        ? { name: "license.jpg", url: currentexternalperson.license_url }
                        : undefined,
                    accept: ".jpg,.jpeg,.png",
                    preview: true,
                    showIf: () => !!currentexternalperson,
                    onChange: handleUploadLicense
                },
                {
                    type: "input",
                    name: "name",
                    label: "Nombre",
                    value: currentexternalperson?.name || "",
                    showIf: () => !!currentexternalperson,
                    validations: [{ type: "required" }],
                },
                {
                    type: "input",
                    name: "lastname",
                    label: "Apellido Paterno",
                    value: currentexternalperson?.lastname || "",
                    showIf: () => !!currentexternalperson,
                    validations: [{ type: "required" }],
                },
                {
                    type: "input",
                    name: "motherslastname",
                    label: "Apellido Materno",
                    value: currentexternalperson?.motherslastname || "",
                    showIf: () => !!currentexternalperson,
                    validations: [{ type: "required" }],
                },
                {
                    type: "input",
                    name: "curp",
                    label: "CURP",
                    value: currentexternalperson?.curp || "",
                    showIf: () => !!currentexternalperson,
                    validations: [{ type: "required" }],
                },

                {
                    type: "input",
                    name: "electorkey",
                    label: "Clave de elector",
                    value: currentexternalperson?.electorkey || "",
                    showIf: () => !!currentexternalperson,
                    validations: [{ type: "required" }],
                },
                {
                    type: "input",
                    name: "electorvigence",
                    label: "Vigencia de credencial de elector",
                    value: currentexternalperson?.electorvigence || "",
                    showIf: () => !!currentexternalperson,
                    validations: [{ type: "required" }],
                },


                {
                    type: "input",
                    name: "license_number",
                    label: "Número de licencia",
                    value: currentexternalperson?.license_number || "",
                    showIf: () => !!currentexternalperson,
                },
                {
                    type: "input",
                    name: "vigence",
                    label: "Vigencia de credencial de Licencia",
                    value: currentexternalperson?.vigence || "",
                    showIf: () => !!currentexternalperson,
                },
                {
                    type: "input",
                    name: "phone_number",
                    label: "Teléfono",
                    value: currentexternalperson?.phone_number || "",
                    showIf: () => !!currentexternalperson,
                    validations: [{ type: "required" }],
                },
                {
                    type: "input",
                    name: "email",
                    label: "Correo Electrónico",
                    value: currentexternalperson?.email || "",
                    showIf: () => !!currentexternalperson,
                    validations: [{ type: "required" }],
                },
                {
                    type: "input",
                    name: "nss",
                    label: "Número de seguridad social",
                    value: currentexternalperson?.nss || "",
                    showIf: () => !!currentexternalperson,
                    // validations: [{ type: "required" }],
                },

            ]
            return (model);
        }
        setFields(formId, initialFields());
        hasInitFields.current = true;
    }




    const handleUploadINE: NonNullable<FieldModel["onChange"]> = (value, values) => {
        if (!(value instanceof File)) {
            showAlert({
                type: "warning",
                title: "Archivo no soportado",
                description: "Selecciona una imagen válida en formato JPG o PNG.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
            return;
        }
        updateField(formId, "frontal_ine_url", { value });

        void (async () => {

            if (!hasInitFrontINE.current && currentexternalperson?.frontal_ine_url) {
                hasInitFrontINE.current = true;
                return;
            }
            showSpinner({ message: "Procesando INE..." });
            try {
                const { text } = await askForOCR(value);
                if (!text) throw new Error("El servicio OCR no devolvió texto legible.");

                const parsed = parseIneText(text);
                setFrontalIneJson(parsed);
                // 1) Reglas de autollenado por key (solo las que tienen origen en el OCR)
                const ocrRules: Record<string, (p: IneData) => unknown> = {
                    name: (p) => p?.nombre?.nombres?.trim(),
                    lastname: (p) => p?.nombre?.primer_apellido?.trim(),
                    motherslastname: (p) => p?.nombre?.segundo_apellido?.trim(),
                    curp: (p) => p?.curp?.trim(),
                    electorkey: (p) => p?.clave_elector?.trim(),
                    electorvigence: (p) => p?.vigencia != null ? String(p.vigencia) : undefined,
                    // agrega más si en el futuro parseas otras piezas
                };

                // 2) Recorre TODAS las keys que ya existen en `values` y muéstralas,
                //    excepto las que deben permanecer ocultas hasta la licencia.
                const keepHidden = new Set(["vigence", "license_number"]);
                for (const key of Object.keys(values ?? {})) {
                    if (!keepHidden.has(key)) {
                        updateField(formId, key, { showIf: () => true });
                    }

                    // Si hay una regla de OCR para esa key, proponemos valor
                    const producer = ocrRules[key];
                    if (!producer) continue;

                    const newValue = producer(parsed);
                    if (typeof newValue === "string") {
                        const v = newValue.trim();
                        if (v) updateField(formId, key, { value: v });
                    } else if (newValue !== undefined) {
                        updateField(formId, key, { value: newValue as any });
                    }
                }

                // 3) Casos especiales (objetos/archivos) que solo quieres mostrar
                //    sin autollenar: frontal_ine_url, back_ine_url y license_url (sin license_number ni vigence todavía).
                const objectLikeKeys = ["frontal_ine_url", "back_ine_url", "license_url"];
                for (const k of objectLikeKeys) {
                    if (k in (values ?? {})) {
                        updateField(formId, k, { showIf: () => true });
                    }
                }
            } catch (error) {
                console.error("[external-access] Error procesando INE", error);
                const description = error instanceof Error ? error.message : "No se pudo completar el análisis. Intenta nuevamente.";
                showAlert({
                    type: "error",
                    title: "Error al procesar la INE",
                    description,
                    showPrimaryButton: false,
                    showSecondaryButton: false,
                    autoCloseMs: 4000,
                });
            } finally {
                hideSpinner();
            }
        })();
    };
    const handleUploadINEBack: NonNullable<FieldModel["onChange"]> = (value) => {
        if (!(value instanceof File)) {
            showAlert({
                type: "warning",
                title: "Archivo no soportado",
                description: "Selecciona una imagen válida en formato JPG o PNG.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
            return;
        }
        updateField(formId, "back_ine_url", { value });
        void (async () => {
            if (!hasInitBackINE.current && currentexternalperson?.back_ine_url) {
                hasInitBackINE.current = true;
                return;
            }

            showSpinner({ message: "Procesando INE..." });

            try {
                const { text } = await askForOCR(value);

                if (!text) {
                    throw new Error("El servicio OCR no devolvió texto legible.");
                }
                const parsed = parseIneMrz(text);
                setBackIneJson(parsed);
            } catch (error) {
                console.error("[external-access] Error procesando INE", error);
                const description =
                    error instanceof Error
                        ? error.message
                        : "No se pudo completar el análisis. Intenta nuevamente.";
                showAlert({
                    type: "error",
                    title: "Error al procesar la INE",
                    description,
                    showPrimaryButton: false,
                    showSecondaryButton: false,
                    autoCloseMs: 4000,
                });
            } finally {
                hideSpinner();
            }
        })();
    }
    const handleUploadLicense: NonNullable<FieldModel["onChange"]> = (value) => {
        if (!(value instanceof File)) {
            showAlert({
                type: "warning",
                title: "Archivo no soportado",
                description: "Selecciona una imagen válida en formato JPG o PNG.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1000,
            });
            return;
        }
        updateField(formId, "license_url", { value });
        void (async () => {
            if (!hasInitLicense.current && currentexternalperson?.license_url) {
                hasInitLicense.current = true;
                return;
            }

            showSpinner({ message: "Procesando Licencia..." });
            try {
                const { text } = await askForOCR(value);

                if (!text) {
                    throw new Error("El servicio OCR no devolvió texto legible.");
                }
                const parsed = parseDriverLicense(text);
                setLicenseJson(parsed);
                // Hacer visibles los campos restantes y autollenarlos con el parser
                const licenseNumber = parsed?.documento?.licencia_numero?.toString().trim();
                const licenseVigence = parsed?.documento?.fecha_vigencia?.toString().trim();

                updateField(formId, "license_number", {
                    showIf: () => true,
                    value: licenseNumber ?? "",
                    validations: [{ type: "required" }],
                });
                updateField(formId, "vigence", {
                    showIf: () => true,
                    value: licenseVigence ?? "",
                    validations: [{ type: "required" }],
                });
            } catch (error) {
                console.error("[external-access] Error procesando Licencia", error);
                const description =
                    error instanceof Error
                        ? error.message
                        : "No se pudo completar el análisis. Intenta nuevamente.";
                showAlert({
                    type: "error",
                    title: "Error al procesar la INE",
                    description,
                    showPrimaryButton: false,
                    showSecondaryButton: false,
                    autoCloseMs: 4000,
                });
            } finally {
                hideSpinner();
            }
        })();
    }

    const uploadOrKeepUrl = async (
        fileOrUrl: any,
        path: string,
        previousUrl?: string
    ): Promise<string> => {
        // Si no hay valor, regresa la URL previa o vacío
        if (!fileOrUrl) return previousUrl ?? "";

        // Si ya es URL https, la dejamos tal cual
        if (typeof fileOrUrl === "string" && fileOrUrl.startsWith("http")) {
            return fileOrUrl;
        }

        // Si es File / Blob u otro tipo soportado, subimos
        try {
            const url = await firebasestorage.uploadImage(fileOrUrl, path);
            if (!url) {
                throw new Error("El servicio de almacenamiento no devolvió una URL.");
            }
            return url;
        } catch (err) {
            console.error(`[vehicle] Error subiendo imagen ${path}`, err);
            throw new Error(`Error al subir la imagen (${path}).`);
        }
    };



    const handleSubmit = async (values: Record<string, any>) => {
        try {
            // Empresa obligatoria para asociar el registro
            const enterpriseId = currentEnterpriseId;
            if (!enterpriseId) {
                showAlert({
                    type: "warning",
                    title: "Empresa no seleccionada",
                    description: "Selecciona una empresa antes de registrar el acceso.",
                    showPrimaryButton: false,
                    showSecondaryButton: false,
                    autoCloseMs: 1000,
                });
                return;
            }
            showSpinner({ message: "Cargando imagenes al sistema" });

            const basePath = `ExternalPersons/${values.curp || values.electorkey || currentexternalperson?.id || "sin-id"}`;

            // 1️⃣ Subir TODAS las imágenes en paralelo
            const [
                pictureURL,
                frontal_ine_url,
                back_ine_url,
                license_url,
            ] = await Promise.all([
                uploadOrKeepUrl(
                    values.pictureURL,
                    `${basePath}/picture`,
                    currentexternalperson?.pictureURL
                ),
                uploadOrKeepUrl(
                    values.frontal_ine_url,
                    `${basePath}/frontal_ine`,
                    currentexternalperson?.frontal_ine_url
                ),
                uploadOrKeepUrl(
                    values.back_ine_url,
                    `${basePath}/back_ine`,
                    currentexternalperson?.back_ine_url
                ),
                uploadOrKeepUrl(
                    values.license_url,
                    `${basePath}/license`,
                    currentexternalperson?.license_url
                ),
            ]);

            const payload: ExternalPersonPost = {
                id_enterprise: String(enterpriseId),
                frontal_ine_json: currentexternalperson?.frontal_ine_json || JSON.stringify(frontalIneJson) || "",
                back_ine_json: currentexternalperson?.back_ine_json || JSON.stringify(backIneJson) || "",
                license_json: currentexternalperson?.license_json || JSON.stringify(licenseJson) || "",
                frontal_ine_url,
                back_ine_url,
                license_url,
                pictureURL,
                name: values?.name ?? "",
                lastname: values?.lastname ?? "",
                motherslastname: values?.motherslastname ?? "",
                curp: values?.curp ?? "",
                electorkey: values?.electorkey ?? "",
                electorvigence: values?.electorvigence ?? "",
                nss: values?.nss ?? "",
                license_number: values?.license_number ?? "",
                vigence: values?.vigence ?? "",
                phone_number: values?.phone_number ?? "",
                email: values?.email ?? "",
            };

            if (currentexternalperson) {
                const externalPerson = await updateExternalPerson({ ...payload, id: currentexternalperson.id });
                if (externalPerson) {
                    updateperson(externalPerson.id, externalPerson);
                }
            }
            else {
                const externalPerson = await createExternalPerson(payload);
                if (externalPerson) {
                    addExternalPerson(externalPerson);
                }
            }

            hideSpinner();
        } catch (err) {
            // Manejo defensivo en caso de fallo previo a flags del store
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



    useEffect(() => {
        resetFields(formId);
        setTimeout(() => {
            loadInitialFields();
            setCanStart(true);
        }, 500)
    }, [resetFields])

    // Efecto de spinner + alerts en base a flags del store
    useEffect(() => {
        if (creating) {
            showSpinner({ message: "Registrando persona" });
            return;
        }
        if (updating) {
            showSpinner({ message: "Actualizando persona" });
            return;
        }
        hideSpinner();

        if (error) {
            showAlert({
                type: "error",
                title: "Ocurrió un error",
                description: error,
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1800,
            });
        }

        if (succesCreate) {

            showAlert({
                type: "success",
                title: "Registro exitoso",
                description: "Se registró la información de la persona.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1400,
            });
        }


        if (succesUpdate) {

            showAlert({
                type: "success",
                title: "Actualización exitosa",
                description: "Se actualizó la información de la persona.",
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1400,
            });
        }


        resetFlags();
    }, [creating, error, succesCreate, updating, succesUpdate, updating, showSpinner, hideSpinner, showAlert, resetFlags])

    return ({
        fields: fieldsByFormId[formId] ?? [],
        handleUploadINE,
        handleSubmit,
        canStart
    })
}
export default useAddExternalPersonForm;
