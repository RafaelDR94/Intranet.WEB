import { saveAs } from "file-saver";
import { useRef } from "react";

import type { Diagnosticreturn, Infohelperreturninferface } from "./types";
import {
    ActivitiesHelper,
    DiagnosticSolutionHelper,
    InfoHelper,
    SignatureHelper,
    SingleTextHelper,
    TableHelper,
} from "./utilities/reportUtilities";

import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
import { exportExcelPro, type ColumnDef, type SheetInput } from "@/app/utilities/Excel/ExportExcel";
import { getUsablePageHeight } from "@/app/utilities/PDF/layout";
import { Table, SingleElement, DataChartElement, ImageElement, newDocument } from "@/app/utilities/PDF/types";
import { urlToBase64 } from "@/app/utilities/PicturesHelper/PictureHelper";
import { resolveImageWithFallback } from "@/app/utilities/PicturesHelper/recoverRemoteImage";
import Logo from "@/assets/images/LogosCG/LogoGC.jpeg";

const sanitizeText = (value: unknown, fallback = "No disponible") => {
    if (value === null || value === undefined) return fallback;
    const str = String(value).trim();
    return str.length > 0 ? str : fallback;
};

const getResidualSize = (value: unknown) => {
    if (Array.isArray(value)) return value.length;
    if (typeof value === "string") return value.length;
    return value ? 1 : 0;
};

let cachedLogoBase64: string | null = null;
const getLogoBase64 = async (): Promise<string | undefined> => {
    if (cachedLogoBase64 !== null) {
        return cachedLogoBase64 || undefined;
    }
    if (typeof window === "undefined") {
        cachedLogoBase64 = "";
        return undefined;
    }
    const base64 = await urlToBase64(Logo.src);
    cachedLogoBase64 = base64;
    return base64 || undefined;
};

const useDocument = () => {
    const imageCacheRef = useRef(new Map<string, string>());
    const { currentReport } = useReportsStore();

    const loadImageFromDataUrl = (dataUrl: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = dataUrl;
        });

    const blobToDataUrl = (blob: Blob): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error ?? new Error("No se pudo leer el blob"));
            reader.readAsDataURL(blob);
        });

    type PdfImageOptions = {
        preserveAlpha?: boolean;
    };

    const normalizeImageForPdf = async (dataUrl: string, options: PdfImageOptions = {}) => {
        if (typeof document === "undefined") {
            return dataUrl;
        }
        const img = await loadImageFromDataUrl(dataUrl);
        const maxWidth = 1600;
        const maxHeight = 1600;
        const needsResize = img.width > maxWidth || img.height > maxHeight;
        const isWebp = dataUrl.startsWith("data:image/webp");

        if (!needsResize && !isWebp) {
            return dataUrl;
        }

        const widthRatio = maxWidth / img.width;
        const heightRatio = maxHeight / img.height;
        const ratio = Math.min(widthRatio, heightRatio, 1);
        const targetWidth = Math.max(1, Math.round(img.width * ratio));
        const targetHeight = Math.max(1, Math.round(img.height * ratio));

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            return dataUrl;
        }

        const outputMime = options.preserveAlpha ? "image/png" : "image/jpeg";

        if (outputMime === "image/jpeg") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, targetWidth, targetHeight);
        }
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        return outputMime === "image/png"
            ? canvas.toDataURL("image/png")
            : canvas.toDataURL("image/jpeg", 0.82);
    };

    const urlToBase64WithRetry = async (url: string, attempts = 2) => {
        let lastError: unknown;
        for (let i = 0; i < attempts; i++) {
            try {
                let dataUrl = "";
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    const recovered = await resolveImageWithFallback(url);
                    dataUrl = await blobToDataUrl(recovered.blob);
                } else {
                    dataUrl = await urlToBase64(url);
                }
                if (dataUrl) {
                    return dataUrl;
                }
            } catch (error) {
                lastError = error;
            }
        }
        if (lastError) {
            console.warn("Error al convertir imagen a base64", lastError);
        }
        return "";
    };

    const ensurePdfImageUrl = async (url: string, options: PdfImageOptions = {}) => {
        if (!url) return "";
        const cacheKey = `${url}|alpha:${options.preserveAlpha ? 1 : 0}`;
        const cached = imageCacheRef.current.get(cacheKey);
        if (cached) return cached;

        let dataUrl = url;
        if (!url.startsWith("data:image")) {
            dataUrl = await urlToBase64WithRetry(url, 2);
            if (!dataUrl) {
                return url;
            }
        }

        let normalized = dataUrl;
        try {
            normalized = await normalizeImageForPdf(dataUrl, options);
        } catch (error) {
            console.warn("No se pudo normalizar la imagen para PDF", error);
        }

        imageCacheRef.current.set(cacheKey, normalized);
        return normalized;
    };

    const makePictureDocument = async () => {
        if (!currentReport) return;

        let iteration = 0;
        const MAX_ITERATIONS = 50;
        const DevicesList = currentReport.reportDeviceView;
        const RefactionList = currentReport.refactions;
        let DevicesTable: Table = {
            title: "Equipos",
            headers: ["Marca ", "Modelo", "Numero de serie"],
            datatable: [[]],
        };
        let RefationsTable: Table = {
            title: "Refacciones",
            headers: [
                "Descripcion ",
                "Marca",
                "Modelo",
                "Numero de serie",
                "Numero de parte",
            ],
            datatable: [[]],
        };
        let SolutionDiagnosticTable: Table = {
            title: "Diagnostico/Solucion",
            headers: ["Diagnostico", "Solucion"],
            datatable: [[]],
        };

        const observations: SingleElement = {
            singletitle: "Observaciones",
            text: currentReport.remarks || "Sin observaciones",
        };
        const diagnostic: SingleElement = {
            singletitle: "Diagnostico",
            text: currentReport.diagnostic || "Sin diagnostico",
        };
        const solution: SingleElement = {
            singletitle: "Solucion",
            text: currentReport.solution || "Ninguna solucion encontrada",
        };
        const documentdata: DataChartElement[] = [];
        const picturesdata: ImageElement[] = [];
        const mapsdata: ImageElement[] = [];
        const documentData = {
            "Ticket": currentReport.ticket,
            "Categoria": currentReport.reportcategories?.name,
            "Tipo de Reporte": currentReport.reportcategories?.typesofreports?.name,
            "Ubicacion": currentReport.location?.name,
        };

        for (const key in documentData) {
            if (documentData[key as keyof typeof documentData]) {
                documentdata.push({
                    label: key,
                    text: documentData[key as keyof typeof documentData],
                });
            }
        }

        if (currentReport.activities.length > 0) {
            const normalizedActivities = await Promise.all(
                currentReport.activities.map(async (picture) => ({
                    title: picture.title,
                    description: picture.description,
                    urlimage: await ensurePdfImageUrl(picture.urlimage),
                }))
            );
            picturesdata.push(...normalizedActivities);
        }

        if (currentReport.maps.length > 0) {
            const normalizedMaps = await Promise.all(
                currentReport.maps.map(async (picture) => ({
                    title: picture.title,
                    description: picture.description,
                    urlimage: await ensurePdfImageUrl(picture.urlimage),
                    height: 220,
                    width: 500,
                }))
            );
            mapsdata.push(...normalizedMaps);
        }

        let Info = { title: "Información", data: documentdata };
        const Pictures = (pictures: ImageElement[]) => ({
            title: "Evidencias de actividades",
            pictures,
        });
        const Maps = (pictures: ImageElement[]) => ({
            title: "Ubicaciones de trabajo",
            pictures,
        });
        const Signature = {
            title: "Firma de responsable",
            signatures: [
                {
                    signature: await ensurePdfImageUrl(currentReport.employeesignurl || "", { preserveAlpha: true }),
                    name: currentReport.employe?.fullname || "Nombre del responsable",
                    charge: currentReport.employe?.workposition?.name || "Cargo del responsable",
                },
            ],
        };

        if (currentReport.model?.clientsign) {
            Signature.signatures.push({
                signature: await ensurePdfImageUrl(currentReport.clientsign.url || "", { preserveAlpha: true }),
                name: currentReport.clientsign.clientname || "Nombre del cliente",
                charge: currentReport.clientsign.clientworkposition || "Cargo del cliente",
            });
        }

        const pages: newDocument[] = [];

        let InforResult: Infohelperreturninferface = {
            remainingHeight: 0,
            residualdata: Info.data.length > 0 ? Info.data : null,
            currentPageData: null,
            consumedHeight: 0,
        };
        let DevicesResult: Infohelperreturninferface = {
            remainingHeight: 0,
            residualdata: DevicesList && DevicesList.length > 0 ? DevicesList : null,
            currentPageData: null,
            consumedHeight: 0,
        };
        let RefactionsResult: Infohelperreturninferface = {
            remainingHeight: 0,
            residualdata: RefactionList && RefactionList.length > 0 ? RefactionList : null,
            currentPageData: null,
            consumedHeight: 0,
        };
        let DiagnosticResult: Diagnosticreturn = {
            remainingHeight: 0,
            residualsolution: solution.text || "",
            residualdiagnostic: diagnostic.text || "",
            currentsolution: null,
            currentdiagnostic: null,
            consumedHeight: 0,
        };
        let ActivitiesResult: Infohelperreturninferface = {
            remainingHeight: 0,
            residualdata: picturesdata.length > 0 ? picturesdata : null,
            currentPageData: null,
            consumedHeight: 0,
        };
        let MapsResults: Infohelperreturninferface = {
            remainingHeight: 0,
            residualdata: mapsdata.length > 0 ? mapsdata : null,
            currentPageData: null,
            consumedHeight: 0,
        };
        let ObservationsResults: Infohelperreturninferface = {
            remainingHeight: 0,
            residualdata: observations.text || "",
            currentPageData: null,
            consumedHeight: 0,
        };
        let SignaturesResults: Infohelperreturninferface = {
            remainingHeight: 0,
            residualdata: Signature.signatures,
            currentPageData: null,
            consumedHeight: 0,
        };

        let finishvalidations = {
            infovalidation: false,
            devicevalidation: false,
            refactionsvalidations: false,
            diagnosticvalidation: false,
            activitiesvalidation: false,
            mapsvalidation: false,
            observationsValidations: false,
            signatureValidations: false,
        };

        let First = true;
        while (
            !finishvalidations.infovalidation ||
            !finishvalidations.devicevalidation ||
            !finishvalidations.refactionsvalidations ||
            !finishvalidations.diagnosticvalidation ||
            !finishvalidations.activitiesvalidation ||
            !finishvalidations.observationsValidations ||
            !finishvalidations.signatureValidations ||
            !finishvalidations.mapsvalidation
        ) {
            iteration++;
            if (iteration > MAX_ITERATIONS) {
                console.warn(
                    `makeUniversalPhotographyDocument: excedido max de ${MAX_ITERATIONS} paginas; aborto para evitar bucle infinito.`
                );
                break;
            }

            const NewPageelements: newDocument["elements"] = [];
            const snapshotBefore = JSON.stringify({
                info: getResidualSize(InforResult.residualdata),
                devices: getResidualSize(DevicesResult.residualdata),
                refactions: getResidualSize(RefactionsResult.residualdata),
                diagnostic: getResidualSize(DiagnosticResult.residualdiagnostic),
                solution: getResidualSize(DiagnosticResult.residualsolution),
                activities: getResidualSize(ActivitiesResult.residualdata),
                maps: getResidualSize(MapsResults.residualdata),
                observations: getResidualSize(ObservationsResults.residualdata),
                signatures: getResidualSize(SignaturesResults.residualdata),
                finishvalidations,
            });
            let remainingHeight = getUsablePageHeight(First);
            let consumedThisIteration = 0;

            if (InforResult.residualdata && InforResult.residualdata.length > 0) {
                InforResult = InfoHelper({
                    remainingHeight,
                    Infodata: InforResult.residualdata,
                });
                remainingHeight = InforResult.remainingHeight;
                consumedThisIteration += InforResult.consumedHeight;
                if (InforResult.currentPageData?.length) {
                    Info = { ...Info, data: InforResult.currentPageData };
                    NewPageelements.push(Info);
                }
                if (!InforResult.residualdata?.length) {
                    finishvalidations = { ...finishvalidations, infovalidation: true };
                }
            } else {
                finishvalidations = { ...finishvalidations, infovalidation: true };
            }

            if (DevicesResult.residualdata && DevicesResult.residualdata.length > 0) {
                DevicesResult = TableHelper({
                    remainingHeight,
                    Infodata: DevicesResult.residualdata,
                });
                remainingHeight = DevicesResult.remainingHeight;
                consumedThisIteration += DevicesResult.consumedHeight;
                if (DevicesResult.currentPageData) {
                    DevicesTable = {
                        ...DevicesTable,
                        datatable: DevicesResult.currentPageData.map((device: any) => [
                            device.device_external_view?.brand,
                            device.device_external_view?.model,
                            device.device_external_view?.serialnumber,
                        ]),
                    };
                    NewPageelements.push(DevicesTable);
                }
                if (!DevicesResult.residualdata?.length) {
                    finishvalidations = { ...finishvalidations, devicevalidation: true };
                }
            } else {
                finishvalidations = { ...finishvalidations, devicevalidation: true };
            }

            if (RefactionsResult.residualdata && RefactionsResult.residualdata.length > 0) {
                RefactionsResult = TableHelper({
                    remainingHeight,
                    Infodata: RefactionsResult.residualdata,
                });
                remainingHeight = RefactionsResult.remainingHeight;
                consumedThisIteration += RefactionsResult.consumedHeight;
                if (RefactionsResult.currentPageData) {
                    RefationsTable = {
                        ...RefationsTable,
                        datatable: RefactionsResult.currentPageData.map((refaction: any) => [
                            refaction.description,
                            refaction.brand,
                            refaction.model,
                            refaction.serialnumber,
                            refaction?.partnumber,
                        ]),
                    };
                    NewPageelements.push(RefationsTable);
                }
                if (!RefactionsResult.residualdata?.length) {
                    finishvalidations = {
                        ...finishvalidations,
                        refactionsvalidations: true,
                    };
                }
            } else {
                finishvalidations = {
                    ...finishvalidations,
                    refactionsvalidations: true,
                };
            }

            if (
                currentReport.model?.diagnostic &&
                currentReport.model?.solution &&
                (DiagnosticResult.residualdiagnostic || DiagnosticResult.residualsolution)
            ) {
                DiagnosticResult = DiagnosticSolutionHelper({
                    remainingHeight,
                    diagnostic: DiagnosticResult.residualdiagnostic || "",
                    solution: DiagnosticResult.residualsolution || "",
                });
                remainingHeight = DiagnosticResult.remainingHeight;
                consumedThisIteration += DiagnosticResult.consumedHeight;
                if (DiagnosticResult.currentdiagnostic || DiagnosticResult.currentsolution) {
                    SolutionDiagnosticTable = {
                        ...SolutionDiagnosticTable,
                        datatable: [
                            [
                                DiagnosticResult.currentdiagnostic ?? "",
                                DiagnosticResult.currentsolution ?? "",
                            ],
                        ],
                    };
                    NewPageelements.push(SolutionDiagnosticTable);
                }
                if (!DiagnosticResult.residualdiagnostic && !DiagnosticResult.residualsolution) {
                    finishvalidations = {
                        ...finishvalidations,
                        diagnosticvalidation: true,
                    };
                }
            } else {
                finishvalidations = {
                    ...finishvalidations,
                    diagnosticvalidation: true,
                };
            }

            if (ActivitiesResult.residualdata && ActivitiesResult.residualdata.length > 0) {
                ActivitiesResult = ActivitiesHelper({
                    remainingHeight,
                    Infodata: ActivitiesResult.residualdata,
                });
                remainingHeight = ActivitiesResult.remainingHeight;
                consumedThisIteration += ActivitiesResult.consumedHeight;
                if (ActivitiesResult.currentPageData) {
                    NewPageelements.push(Pictures(ActivitiesResult.currentPageData));
                }
                if (!ActivitiesResult.residualdata?.length) {
                    finishvalidations = {
                        ...finishvalidations,
                        activitiesvalidation: true,
                    };
                }
            } else {
                finishvalidations = {
                    ...finishvalidations,
                    activitiesvalidation: true,
                };
            }

            if (MapsResults.residualdata && MapsResults.residualdata.length > 0) {
                MapsResults = ActivitiesHelper({
                    remainingHeight,
                    Infodata: MapsResults.residualdata,
                });
                remainingHeight = MapsResults.remainingHeight;
                consumedThisIteration += MapsResults.consumedHeight;
                if (MapsResults.currentPageData) {
                    NewPageelements.push(Maps(MapsResults.currentPageData));
                }
                if (!MapsResults.residualdata?.length) {
                    finishvalidations = { ...finishvalidations, mapsvalidation: true };
                }
            } else {
                finishvalidations = { ...finishvalidations, mapsvalidation: true };
            }

            if (ObservationsResults.residualdata && ObservationsResults.residualdata.length > 0) {
                ObservationsResults = SingleTextHelper({
                    remainingHeight,
                    Infodata: ObservationsResults.residualdata,
                });
                remainingHeight = ObservationsResults.remainingHeight;
                consumedThisIteration += ObservationsResults.consumedHeight;
                if (ObservationsResults.currentPageData && ObservationsResults.currentPageData.length > 0) {
                    NewPageelements.push({
                        ...observations,
                        text: ObservationsResults.currentPageData,
                    });
                }
                if (!ObservationsResults.residualdata?.length) {
                    finishvalidations = {
                        ...finishvalidations,
                        observationsValidations: true,
                    };
                }
            } else {
                finishvalidations = {
                    ...finishvalidations,
                    observationsValidations: true,
                };
            }

            if (SignaturesResults.residualdata && SignaturesResults.residualdata.length > 0) {
                SignaturesResults = SignatureHelper({
                    remainingHeight,
                    Infodata: SignaturesResults.residualdata,
                });
                remainingHeight = SignaturesResults.remainingHeight;
                consumedThisIteration += SignaturesResults.consumedHeight;
                if (SignaturesResults.currentPageData && SignaturesResults.currentPageData.length > 0) {
                    NewPageelements.push({
                        ...Signature,
                        signatures: SignaturesResults.currentPageData,
                    });
                }
                if (!SignaturesResults.residualdata?.length) {
                    finishvalidations = {
                        ...finishvalidations,
                        signatureValidations: true,
                    };
                }
            } else {
                finishvalidations = {
                    ...finishvalidations,
                    signatureValidations: true,
                };
            }

            const snapshotAfter = JSON.stringify({
                info: getResidualSize(InforResult.residualdata),
                devices: getResidualSize(DevicesResult.residualdata),
                refactions: getResidualSize(RefactionsResult.residualdata),
                diagnostic: getResidualSize(DiagnosticResult.residualdiagnostic),
                solution: getResidualSize(DiagnosticResult.residualsolution),
                activities: getResidualSize(ActivitiesResult.residualdata),
                maps: getResidualSize(MapsResults.residualdata),
                observations: getResidualSize(ObservationsResults.residualdata),
                signatures: getResidualSize(SignaturesResults.residualdata),
                finishvalidations,
            });

            if (NewPageelements.length === 0 || consumedThisIteration <= 0 || snapshotBefore === snapshotAfter) {
                console.warn(
                    "makeUniversalPhotographyDocument: ninguna seccion avanzo en esta iteracion, aborto para evitar bucle infinito."
                );
                break;
            }

            let newPage: newDocument = {
                folio: "",
                elements: NewPageelements,
            };
            if (First) {
                newPage = {
                    ...newPage,
                    title: currentReport.reportcategories?.typesofreports?.name || "Reporte",
                    progress: currentReport.progress,
                    folio: currentReport.startdate + " - " + currentReport.enddate,
                };
                First = false;
            }

            if (newPage.elements.length > 0) {
                pages.push(newPage);
            }
        }

        return { pages };
    };

    const exportExcel = async () => {
        if (!currentReport) {
            throw new Error("No hay reporte seleccionado");
        }

        const activities = currentReport.activities ?? [];
        const maps = currentReport.maps ?? [];
        const refactions = currentReport.refactions ?? [];
        const devices = currentReport.reportDeviceView ?? [];

        const generalColumns: ColumnDef[] = [
            { key: "campo", header: "Campo", width: 32 },
            { key: "valor", header: "Valor", width: 60 },
        ];

        const generalRows: Record<string, string>[] = [
            { campo: "Ticket", valor: sanitizeText(currentReport.ticket, "Sin ticket") },
            { campo: "Tipo de reporte", valor: sanitizeText(currentReport.reportcategories?.typesofreports?.name, "Sin tipo") },
            { campo: "Categoria", valor: sanitizeText(currentReport.reportcategories?.name, "Sin categoria") },
            { campo: "Proyecto", valor: sanitizeText(currentReport.proyect?.name, "Sin proyecto") },
            { campo: "Cliente", valor: sanitizeText(currentReport.proyect?.client, "Sin cliente") },
            { campo: "Ubicacion", valor: sanitizeText(currentReport.location?.name, "Sin ubicacion") },
            { campo: "Direccion", valor: sanitizeText(currentReport.location?.address, "Sin direccion") },
            { campo: "Link de mapas", valor: sanitizeText(currentReport.location?.linkmaps, "Sin link") },
            { campo: "Responsable", valor: sanitizeText(currentReport.employe?.fullname, "Sin responsable") },
            { campo: "Puesto responsable", valor: sanitizeText(currentReport.employe?.workposition?.name, "Sin puesto") },
            { campo: "Fecha de inicio", valor: sanitizeText(currentReport.startdate, "Sin fecha") },
            { campo: "Fecha de cierre", valor: sanitizeText(currentReport.enddate, "Sin fecha") },
            { campo: "Progreso", valor: sanitizeText(currentReport.progress, "Sin progreso") },
            { campo: "Diagnostico", valor: sanitizeText(currentReport.diagnostic, "Sin diagnostico") },
            { campo: "Solucion", valor: sanitizeText(currentReport.solution, "Sin solucion") },
            { campo: "Observaciones", valor: sanitizeText(currentReport.remarks, "Sin observaciones") },
            { campo: "Folio interno", valor: sanitizeText(currentReport.front_identifier, "Sin folio") },
        ];

        const sheets: SheetInput[] = [
            {
                name: "Información general",
                columns: generalColumns,
                rows: generalRows,
            },
        ];

        const activitiesColumns: ColumnDef[] = [
            { key: "titulo", header: "Titulo", width: 35 },
            { key: "descripcion", header: "Descripcion", width: 60 },
            { key: "fecha", header: "Fecha", width: 25 },
            { key: "evidencia", header: "URL evidencia", width: 60 },
        ];

        const activitiesRows: Record<string, string>[] = activities.map((activity) => ({
            titulo: sanitizeText(activity.title, "Sin titulo"),
            descripcion: sanitizeText(activity.description, "Sin descripcion"),
            fecha: sanitizeText(activity.date, "Sin fecha"),
            evidencia: sanitizeText(activity.urlimage, ""),
        }));

        if (activitiesRows.length === 0) {
            activitiesRows.push({
                titulo: "Sin actividades registradas",
                descripcion: "",
                fecha: "",
                evidencia: "",
            });
        }

        sheets.push({
            name: "Actividades",
            columns: activitiesColumns,
            rows: activitiesRows,
        });

        if (maps.length > 0) {
            const mapColumns: ColumnDef[] = [
                { key: "titulo", header: "Titulo", width: 35 },
                { key: "descripcion", header: "Descripcion", width: 60 },
                { key: "fecha", header: "Fecha", width: 25 },
                { key: "mapa", header: "URL mapa", width: 60 },
            ];

            const mapRows: Record<string, string>[] = maps.map((map) => ({
                titulo: sanitizeText(map.title, "Sin titulo"),
                descripcion: sanitizeText(map.description, "Sin descripcion"),
                fecha: sanitizeText(map.date, "Sin fecha"),
                mapa: sanitizeText(map.urlimage, ""),
            }));

            sheets.push({
                name: "Mapas de trabajo",
                columns: mapColumns,
                rows: mapRows,
            });
        }

        if (refactions.length > 0) {
            const refactionColumns: ColumnDef[] = [
                { key: "descripcion", header: "Descripcion", width: 40 },
                { key: "marca", header: "Marca", width: 25 },
                { key: "modelo", header: "Modelo", width: 25 },
                { key: "numeroSerie", header: "Numero de serie", width: 30 },
                { key: "numeroParte", header: "Numero de parte", width: 30 },
            ];

            const refactionRows: Record<string, string>[] = refactions.map((item) => ({
                descripcion: sanitizeText(item.description, "Sin descripcion"),
                marca: sanitizeText(item.brand, "Sin marca"),
                modelo: sanitizeText(item.model, "Sin modelo"),
                numeroSerie: sanitizeText(item.serialnumber, ""),
                numeroParte: sanitizeText(item.partnumber, ""),
            }));

            sheets.push({
                name: "Refacciones",
                columns: refactionColumns,
                rows: refactionRows,
            });
        }

        if (devices.length > 0) {
            const deviceColumns: ColumnDef[] = [
                { key: "marca", header: "Marca", width: 25 },
                { key: "modelo", header: "Modelo", width: 25 },
                { key: "numeroSerie", header: "Numero de serie", width: 30 },
                { key: "Información", header: "Información adicional", width: 60 },
            ];

            const deviceRows: Record<string, string>[] = devices.map((item) => ({
                marca: sanitizeText(item.device_external_view?.brand, "Sin marca"),
                modelo: sanitizeText(item.device_external_view?.model, "Sin modelo"),
                numeroSerie: sanitizeText(item.device_external_view?.serialnumber, ""),
            }));

            sheets.push({
                name: "Dispositivos",
                columns: deviceColumns,
                rows: deviceRows,
            });
        }

        const logoBase64 = await getLogoBase64();
        const reportTypeName = currentReport.reportcategories?.typesofreports?.name;

        const sanitizeSegment = (value: unknown) => {
            if (!value) return "";
            return String(value)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9]+/g, "_")
                .replace(/_+/g, "_")
                .replace(/^_|_$/g, "");
        };

        const fileSegments = [
            sanitizeSegment(currentReport.ticket),
            sanitizeSegment(currentReport.proyect?.proyectKey),
            sanitizeSegment(currentReport.id),
        ].filter(Boolean);

        const fileName = ["reporte", ...fileSegments].join("_") || "reporte";

        await exportExcelPro({
            fileName,
            logoBase64,
            sheets,
            meta: {
                title: reportTypeName ? `Reporte ${reportTypeName}` : "Reporte",
                cliente: currentReport.proyect?.client || undefined,
                proyecto: currentReport.proyect?.name || undefined,
                semana:
                    currentReport.startdate && currentReport.enddate
                        ? `${currentReport.startdate} - ${currentReport.enddate}`
                        : undefined,
            },
            zebra: true,
            autoFilter: true,
            saver: (blob, generatedName) => saveAs(blob, generatedName),
        });
    };

    return { makePictureDocument, exportExcel };
};

export default useDocument;
