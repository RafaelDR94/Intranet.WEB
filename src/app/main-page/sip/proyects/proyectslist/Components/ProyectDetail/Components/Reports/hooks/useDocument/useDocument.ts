
import { saveAs } from "file-saver";

import { Infohelperreturninferface } from "./types";
import { ActivitiesHelper, InfoHelper,TableHelper,DiagnosticSolutionHelper,SignatureHelper,SingleTextHelper} from "./utilities/reportUtilities";

import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
import { exportExcelPro, type SheetInput, type ColumnDef } from "@/app/utilities/Excel/ExportExcel";
import { Table, SingleElement, DataChartElement, ImageElement, newDocument } from "@/app/utilities/PDF/types";
import { urlToBase64 } from "@/app/utilities/PicturesHelper/PictureHelper";
import Logo from "@/assets/images/LogosDR/DRLogoOficial.png";

const sanitizeText = (value: unknown, fallback = "No disponible") => {
    if (value === null || value === undefined) return fallback;
    const str = String(value).trim();
    return str.length > 0 ? str : fallback;
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
    const { currentReport } = useReportsStore();
    const makePictureDocument = () => {
        if (!currentReport) return;
        let iteration = 0;
        const MAX_ITERATIONS = 50;
        const DevicesList = currentReport?.reportDeviceView;
        const  RefactionList = currentReport?.refactions;
        let DevicesTable: Table = {
            title: "Equipos",
            headers: ["Marca ", "Modelo", "Número de serie"],
            datatable: [[]],
        };
        let RefationsTable: Table = {
            title: "Refacciones",
            headers: [
                "Descripción ",
                "Marca",
                "Modelo",
                "Número de serie",
                "Número de parte",
            ],
            datatable: [[]],
        };
        let SolutionDiagnosticTable: Table = {
            title: "Diagnóstico/Solución",
            headers: ["Diagnóstico", "Solución"],
            datatable: [[]],
        };

        const observations: SingleElement = {
            singletitle: "Observaciones",
            text: currentReport?.remarks || "Sin observaciones",
        };
        const diagnostic: SingleElement = {
            singletitle: "Diagnóstico",
            text: currentReport?.diagnostic || "Sin diagnóstico",
        };
        const solution: SingleElement = {
            singletitle: "Solución",
            text: currentReport?.solution || "Ninguna solución encontrada",
        };
        const documentdata: DataChartElement[] = [];
        const picturesdata: ImageElement[] = [];
        const mapsdata: ImageElement[] = [];
        const documentData = { "Ticket": currentReport?.ticket, "Categoría": currentReport?.reportcategories?.name, "Tipo de Reporte": currentReport.reportcategories?.typesofreports?.name, "Ubicación": currentReport.location?.name }
        for (const key in documentData) {
            if (documentData[key as keyof typeof documentData]) {
                documentdata.push({
                    label: key,
                    text: documentData[key as keyof typeof documentData],
                });
            }
        }
        if (currentReport.activities.length > 0) {
            currentReport.activities.forEach((picture) => {
                picturesdata.push({
                    title: picture.title,
                    description: picture.description,
                    urlimage: picture.urlimage,
                });
            });
        }
        if (currentReport.maps.length > 0) {
            currentReport.maps.forEach((picture) => {
                mapsdata.push({
                    title: picture.title,
                    description: picture.description,
                    urlimage: picture.urlimage,
                    height: 220,
                    width: 500,
                });
            });
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
                    signature: currentReport?.employeesignurl || "",
                    name: currentReport?.employe?.fullname || "Nombre del responsable",
                    charge: currentReport?.employe?.workposition?.name || "Cargo del responsable",
                },
            ],

        };
        if (currentReport?.model?.clientsign) {
            Signature.signatures.push({
                signature: currentReport?.clientsign.url || "",
                name: currentReport?.clientsign.clientname || "Nombre del cliente",
                charge: currentReport?.clientsign.clientworkposition || "Cargo del cliente",
            })
        }
        const pages: newDocument[] = [];

        let InforResult: Infohelperreturninferface = {
            newPagePoints: 0,
            residualdata: Info?.data && Info.data.length > 0 ? Info.data : null,
            currentPageData: null,
        };
        let DevicesResult: Infohelperreturninferface = {
            newPagePoints: 0,
            residualdata: DevicesList && DevicesList.length > 0 ? DevicesList : null,
            currentPageData: null,
        };
        let RefactionsResult: Infohelperreturninferface = {
            newPagePoints: 0,
            residualdata:
                RefactionList && RefactionList.length > 0 ? RefactionList : null,
            currentPageData: null,
        };
        let DiagnosticResult = {
            newPagePoints: 0,
            residualsolution: solution?.text || "",
            residualdiagnostic: diagnostic?.text || "",
            currentsolution: null,
            currentdiagnostic: null,
        };
        let ActivitiesResult: Infohelperreturninferface = {
            newPagePoints: 0,
            residualdata:
                picturesdata && picturesdata.length > 0 ? picturesdata : null,
            currentPageData: null,
        };
        let MapsResults: Infohelperreturninferface = {
            newPagePoints: 0,
            residualdata: mapsdata && mapsdata.length > 0 ? mapsdata : null,
            currentPageData: null,
        };
        let ObservationsResults: Infohelperreturninferface = {
            newPagePoints: 0,
            residualdata: observations?.text || "",
            currentPageData: null,
        };
        let SignaturesResults: Infohelperreturninferface = {
            newPagePoints: 0,
            residualdata: Signature.signatures,
            currentPageData: null,
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

        let NewPagePoints = 12; // Inicializa con 13 solo para la primera vuelta
        let First = true;
        while (
            !finishvalidations.infovalidation ||
            !finishvalidations.devicevalidation ||
            !finishvalidations.refactionsvalidations ||
            !finishvalidations.diagnosticvalidation ||
            !finishvalidations.observationsValidations ||
            !finishvalidations.signatureValidations ||
            !finishvalidations.mapsvalidation
        ) {
            iteration++;
            if (iteration > MAX_ITERATIONS) {
                console.warn(
                    `⚠️ makeUniversalPhotographyDocument: excedido max de ${MAX_ITERATIONS} páginas—aborto para evitar bucle infinito.`
                );
                break;
            }
            const NewPageelements: any = [];
    
            if (InforResult?.residualdata && InforResult.residualdata.length > 0) {
                InforResult = InfoHelper({
                    PagePoints: NewPagePoints,
                    Infodata: InforResult?.residualdata,
                });
                NewPagePoints = InforResult.newPagePoints;
                Info = { ...Info, data: InforResult.currentPageData };
                NewPageelements.push(Info);
            } else {
                finishvalidations = { ...finishvalidations, infovalidation: true };
            }


            if (
                DevicesResult?.residualdata &&
                DevicesResult.residualdata.length > 0
            ) {
                DevicesResult = TableHelper({
                    PagePoints: NewPagePoints,
                    Infodata: DevicesResult?.residualdata,
                });
                NewPagePoints = DevicesResult.newPagePoints;
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
            } else {
                finishvalidations = { ...finishvalidations, devicevalidation: true };
            }

            if (
                RefactionsResult?.residualdata &&
                RefactionsResult.residualdata.length > 0
            ) {
                RefactionsResult = TableHelper({
                    PagePoints: NewPagePoints,
                    Infodata: RefactionsResult?.residualdata,
                });
                NewPagePoints = RefactionsResult.newPagePoints;
                if (RefactionsResult.currentPageData) {
                    RefationsTable = {
                        ...RefationsTable,
                        datatable: RefactionsResult.currentPageData.map(
                            (refaction: any) => [
                                refaction.description,
                                refaction.brand,
                                refaction.model,
                                refaction.serialnumber,
                                refaction?.partnumber,
                            ]
                        ),
                    };
                    NewPageelements.push(RefationsTable);
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
                (DiagnosticResult?.residualdiagnostic ||
                    DiagnosticResult?.residualsolution)
            ) {
                DiagnosticResult = DiagnosticSolutionHelper({
                    PagePoints: NewPagePoints,
                    diagnostic: DiagnosticResult?.residualdiagnostic,
                    solution: DiagnosticResult?.residualsolution,
                });
                NewPagePoints = DiagnosticResult.newPagePoints;
                if (
                    DiagnosticResult.currentdiagnostic ||
                    DiagnosticResult.currentsolution
                ) {
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
            } else {
                finishvalidations = {
                    ...finishvalidations,
                    diagnosticvalidation: true,
                };
            }


            if (
                ActivitiesResult?.residualdata &&
                ActivitiesResult.residualdata.length > 0
            ) {
                ActivitiesResult = ActivitiesHelper({
                    PagePoints: NewPagePoints,
                    Infodata: ActivitiesResult.residualdata,
                    LinePoints: 3,
                });
                if (ActivitiesResult.currentPageData) {
                    NewPageelements.push(Pictures(ActivitiesResult.currentPageData));
                }

                NewPagePoints = ActivitiesResult.newPagePoints;
            } else {
                finishvalidations = {
                    ...finishvalidations,
                    activitiesvalidation: true,
                };
            }


            if (MapsResults?.residualdata && MapsResults.residualdata.length > 0) {
                MapsResults = ActivitiesHelper({
                    PagePoints: NewPagePoints,
                    Infodata: MapsResults.residualdata,
                    LinePoints: 5,
                });
                if (MapsResults.currentPageData) {
                    NewPageelements.push(Maps(MapsResults.currentPageData));
                }
                NewPagePoints = MapsResults.newPagePoints;
            } else {
                finishvalidations = { ...finishvalidations, mapsvalidation: true };
            }

            if (
                ObservationsResults?.residualdata &&
                ObservationsResults.residualdata.length > 0
            ) {
                ObservationsResults = SingleTextHelper({
                    PagePoints: NewPagePoints,
                    Infodata: ObservationsResults.residualdata,
                });
                NewPagePoints = ObservationsResults.newPagePoints;
                if (
                    ObservationsResults.currentPageData &&
                    ObservationsResults.currentPageData.length > 0
                ) {

                    NewPageelements.push({
                        ...observations,
                        text: ObservationsResults.currentPageData,
                    });
                }
            } else {
                finishvalidations = {
                    ...finishvalidations,
                    observationsValidations: true,
                };
            }

            if (
                SignaturesResults?.residualdata &&
                SignaturesResults.residualdata.length > 0
            ) {
                SignaturesResults = SignatureHelper({
                    PagePoints: NewPagePoints,
                    Infodata: SignaturesResults.residualdata,
                });
                NewPagePoints = SignaturesResults.newPagePoints;
                if (
                    SignaturesResults.currentPageData &&
                    SignaturesResults.currentPageData.length > 0
                ) {
                    NewPageelements.push({
                        ...Signature,
                        signatures: SignaturesResults.currentPageData,
                    });
                }
            } else {
                finishvalidations = {
                    ...finishvalidations,
                    signatureValidations: true,
                };
            }

            if (NewPageelements.length === 0) {
                console.warn(
                    "⚠️ makeUniversalPhotographyDocument: ninguna sección aportó elementos en esta iteración, aborto para evitar bucle infinito."
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
                    title: currentReport.reportcategories?.typesofreports?.name|| "Reporte",
                    progress: currentReport.progress,
                    folio: currentReport.startdate+" - "+currentReport.enddate,
                };
                First = false;
            }

            if (newPage.elements.length > 0) pages.push(newPage);

            // Asegurar que las siguientes iteraciones usen 15

            NewPagePoints = 13;
        }

        return { pages };
    }

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
                name: "Informacion general",
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
                { key: "informacion", header: "Informacion adicional", width: 60 },
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

}
export default useDocument;

