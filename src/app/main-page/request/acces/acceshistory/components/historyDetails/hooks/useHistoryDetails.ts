import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { LabelType } from "@/app/components/Label/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useRouter } from "next/navigation";
import useAccessPdf from "./useAccesDocuments";
import { ManifestConfig } from "./utilities/manifestDocumentUtilitie";
import { DetentarLetterConfig } from "./utilities/detentarDocumentUrtil";
import JSZip from "jszip";
import { ExternalPersonModel } from "@/app/mappings/externalperson/externalperson.types";
import { CompleteTransport } from "@/app/mappings/transport/transport.types";
import { currentDateEs } from "@/app/utilities/DatesHelper/Dateshelper";
import { AccesRequirmentGet } from "@/app/mappings/accesrequest/accesrequest.types";
const useHistoryDetails = () => {
    const router = useRouter();
    const { generateAccessPdf, generateManifestPdf, generateDetentarLetterPdf, generateToolsExcel } = useAccessPdf();
    const { usePrincipalLoading } = usePrincipal();
    const [activeNav, setActiveNav] = useState("information");
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { all } = useQuery();
    const idAcces = all.idAcces;

    const mapStatusToLabel = (status?: string): LabelType => {
        const s = (status || "").toLowerCase();
        if (s.includes("aprobada")) return "valido";
        if (s.includes("rechaz")) return "rechazado";
        if (s.includes("enviad")) return "actualizado";
        if (s.includes("finaliz")) return "restringido";
        if (s.includes("pendiente")) return "pendiente";
        if (s.includes("cancel")) return "sin-factura";
        if (s.includes("incidencia")) return "vale-rosa";
        return "actualizado";
    };

    const { fetchAccesRequirementById, currentAcces, generateTemplate } =
        useAccesRequirementStore(
            (s) => ({
                fetchAccesRequirementById: s.fetchAccesRequirementById,
                currentAcces: s.current,
                generateTemplate: s.generateTemplate,
            }),
            shallow,
        );
    const repeatArray = <T,>(
        arr: T[],
        times: number,
        mutate?: (item: T, index: number, copyIndex: number) => T
    ): T[] => {
        const result: T[] = [];
        for (let copy = 0; copy < times; copy++) {
            arr.forEach((item, idx) => {
                // Por si quieres modificar algo (ej: agregar sufijo al nombre)
                const newItem = mutate ? mutate(item, idx, copy) : item;
                result.push(newItem);
            });
        }
        return result;
    };

    const buildStressAccess = (
        acces: AccesRequirmentGet,
        personsFactor = 1,
        toolsFactor = 1,
        vehiclesFactor = 1
    ): AccesRequirmentGet => {
        const externalpersons = repeatArray(
            acces.externalpersons,
            personsFactor,
            (p, _idx, copy) => ({
                ...p,
                // opcional: cambiar el id/nombre para que no choquen
                id: `${p.id}_copy_${copy}`,
                name: `${p.name} (${copy + 1})`,
            })
        );

        const tools = repeatArray(
            acces.tools,
            toolsFactor,
            (t, _idx, copy) => ({
                ...t,
                description: `${t.description} (copy ${copy + 1})`,
            })
        );

        // Vehículos si quieres también inflarlos
        const vehicles = repeatArray(
            acces.vehicles,
            vehiclesFactor, // o el factor que quieras
            (v, _idx, copy) => ({
                ...v,
                transport_id: `${v.transport_id}_copy_${copy}`,
                plates: `${v.plates}-C${copy + 1}`, // para distinguir
            })
        );

        return {
            ...acces,
            externalpersons,
            tools,
            vehicles,
        };
    };
    const handleDownloadZIP = async () => {
        if (!currentAcces) return;
        showSpinner({ message: "Descargando archivo" });

        try {
            // 🔥 Versión inflada SOLO PARA PROBAR
            const stressAcces = buildStressAccess(currentAcces, 1, 1, 1);
            const accesForZip = stressAcces; // o currentAcces en producción


            const zip = new JSZip();

            // 1) PDFs
            const cfg1: DetentarLetterConfig = {
                recipientName: accesForZip.location_responsible,
                recipientTitle: accesForZip.location_workposition,
                signerRole:"Responsable",
                cityAndDate: currentDateEs(),
                workDescription: accesForZip.motive,
            };

            await new Promise<void>((resolve) => {
                void generateDetentarLetterPdf(accesForZip, cfg1, async (url) => {
                    try {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        zip.file(`CARTA_DE_DETENTAR_${accesForZip.id}.pdf`, blob);
                    } finally {
                        URL.revokeObjectURL(url);
                        resolve();
                    }
                }, "DR");
            });

            const cfg: ManifestConfig = {
                recipientName: accesForZip.location_responsible,
                recipientTitle: accesForZip.location_workposition,
                locationName: accesForZip.location.name,
                cityAndDate: currentDateEs(),
                workDescription: accesForZip.motive,
            };

            await new Promise<void>((resolve) => {
                void generateManifestPdf(accesForZip, cfg, async (url) => {
                    try {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        zip.file(`MANIFIESTO_${accesForZip.id}.pdf`, blob);
                    } finally {
                        URL.revokeObjectURL(url);
                        resolve();
                    }
                }, "DR");
            });

            await new Promise<void>((resolve) => {
                void generateAccessPdf(accesForZip, async (url: string) => {
                    try {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        zip.file(`SolicitudAcceso_${accesForZip.id}.pdf`, blob);
                    } finally {
                        URL.revokeObjectURL(url);
                        resolve();
                    }
                }, "DR");
            });

            // 2) Imágenes de personas en carpeta
            if (accesForZip.externalpersons && accesForZip.externalpersons.length > 0) {
                const personsFolder = zip.folder("personas");
                if (personsFolder) {
                    for (const person of accesForZip.externalpersons as ExternalPersonModel[]) {
                        const personName = `${person.name || "sin_nombre"}_${person.lastname || ""}`.trim();
                        const personFolder = personsFolder.folder(personName || "persona");
                        if (!personFolder) continue;

                        const files = [
                            { url: person.back_ine_url, name: "back_ine.jpg" },
                            { url: person.frontal_ine_url, name: "frontal_ine.jpg" },
                            { url: person.license_url, name: "license.jpg" },
                            { url: person.pictureURL, name: "picture.jpg" },
                        ];

                        for (const file of files) {
                            if (!file.url) continue;
                            const response = await fetch(file.url);
                            const blob = await response.blob();
                            personFolder.file(file.name, blob);
                        }
                    }
                }
            }

            // 3) Imágenes de vehículos en carpeta
            if (accesForZip.vehicles && accesForZip.vehicles.length > 0) {
                const vehiclesFolder = zip.folder("vehiculos");
                if (vehiclesFolder) {
                    let index = 1;
                    for (const vehicle of accesForZip.vehicles as CompleteTransport[]) {
                        const vehicleName = vehicle.plates || `vehiculo_${index}`;
                        index += 1;
                        const vehicleFolder = vehiclesFolder.folder(vehicleName);
                        if (!vehicleFolder) continue;

                        const files = [
                            { url: vehicle.image_plates, name: "placa.jpg" },
                            { url: vehicle.image_circulation_card, name: "tarjeta_circulacion.jpg" },
                            { url: vehicle.front_image, name: "imagen_frontal.jpg" },
                            { url: vehicle.right_side_image, name: "lado_derecho.jpg" },
                            { url: vehicle.left_side_image, name: "lado_izquierdo.jpg" },
                            { url: vehicle.back_image, name: "imagen_trasera.jpg" },
                            { url: vehicle.insurance_policy_doc, name: "poliza_seguro.pdf" },
                        ];

                        for (const file of files) {
                            if (!file.url) continue;
                            const response = await fetch(file.url);
                            const blob = await response.blob();
                            vehicleFolder.file(file.name, blob);
                        }
                    }
                }
            }

            // 4) Archivo de template (Excel) desde backend
            const responseTemplate: any = await generateTemplate(accesForZip.id);

            let excelBlob: Blob | null = null;

            // 4.1) URL directa
            if (typeof responseTemplate === "string" && responseTemplate.startsWith("http")) {
                const resp = await fetch(responseTemplate);
                excelBlob = await resp.blob();
            } else {
                // 4.2) Arreglo de bytes
                let bytes: Uint8Array | null = null;

                if (Array.isArray(responseTemplate)) {
                    bytes = new Uint8Array(responseTemplate as number[]);
                } else if (responseTemplate?.bytes && Array.isArray(responseTemplate.bytes)) {
                    bytes = new Uint8Array(responseTemplate.bytes as number[]);
                } else if (responseTemplate?.data && Array.isArray(responseTemplate.data)) {
                    bytes = new Uint8Array(responseTemplate.data as number[]);
                }

                if (bytes) {
                    excelBlob = new Blob([bytes as any], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    });
                } else if (typeof responseTemplate === "string") {
                    // 4.3) Base64 plain
                    const b64 = responseTemplate.includes(",")
                        ? responseTemplate.split(",")[1]
                        : responseTemplate;
                    try {
                        const bin = atob(b64);
                        const len = bin.length;
                        const buf = new Uint8Array(len);
                        for (let i = 0; i < len; i++) buf[i] = bin.charCodeAt(i);
                        excelBlob = new Blob([buf], {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        });
                    } catch {
                        excelBlob = null;
                    }
                }
            }

            if (excelBlob) {
                zip.file(`acceso_${accesForZip.id}_finalizacion.xlsx`, excelBlob);
            } else {
                alert(
                    "No se pudo agregar el archivo de finalización al ZIP. Formato de respuesta no reconocido.",
                );
            }

            // 4.b) Excel con listado de herramientas (tools) generado en cliente
            const toolsExcelBlob = await generateToolsExcel(accesForZip);
            if (toolsExcelBlob) {
                zip.file(`acceso_${accesForZip.id}_herramientas.xlsx`, toolsExcelBlob);
            }

            // 5) Generar y descargar ZIP final
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `acceso_${accesForZip.id}_documentos.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } finally {
            hideSpinner();
        }
    };



    const handleActiveChange = (active: string) => {
        setActiveNav(active);
    };

    useEffect(() => {
        if (idAcces && !currentAcces) {
            fetchAccesRequirementById(String(idAcces));
        }
    }, [idAcces, fetchAccesRequirementById, currentAcces]);

    const handleEditInformation = () => {
        if (!currentAcces?.id) return;
        if (activeNav === "information") {
            router.push(
                `/main-page/request/acces/generateacces/?idAcces=${encodeURIComponent(
                    currentAcces.id,
                )}&mode=edit&enterpriseId=${currentAcces.external_enterprise?.enterprise_id}`,
            );
        } else {
            router.push(
                `/main-page/request/acces/generateacces/?idAcces=${encodeURIComponent(
                    currentAcces.id,
                )}&force=true&enterpriseId=${currentAcces.external_enterprise?.enterprise_id}`,
            );
        }
    };

    const canSeeEditButton = () => {
        if (activeNav === "comments") return false;
        if (
            currentAcces?.status === "A finalizado" ||
            currentAcces?.status === "A rechazado" ||
            currentAcces?.status === "Cancelada" ||
            currentAcces?.status === "Enviada" ||
            currentAcces?.status === "I Aprobada" ||
            currentAcces?.status === "Incidencia"
        ) {
            return false;
        }
        return true;
    };

    return {
        currentAcces,
        mapStatusToLabel,
        handleDownloadZIP,
        handleEditInformation,
        handleActiveChange,
        canSeeEditButton,
    };
};

export default useHistoryDetails;

