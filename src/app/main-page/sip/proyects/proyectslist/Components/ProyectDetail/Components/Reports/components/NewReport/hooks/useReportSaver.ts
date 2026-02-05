import { useState, useEffect } from "react";
import { base64ToBlob, optimizeDataUrlToBlob } from '@/app/utilities/PicturesHelper/PictureHelper';
import { Activities, ReportView } from '@/app/mappings/reports/reports.types';
import { currentDate } from '@/app/utilities/DatesHelper/Dateshelper';
import { isProduction } from '@/app/configurations/Axios/Clients';
import { useFirebase } from '@/app/context/FirebaseContext/FirebaseContext';
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useReportsStore } from "@/app/stores/useReportsStore/useReportsStore";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { useAuth } from "@/app/context/AuthContext/AuthContext";
import useReportBuilderStore from "@/app/stores/useReportBuilderStore/useReportBuilderStore";

const useReportSaver = () => {
    const { firebasestorage } = useFirebase()
    const [savinging, setSavinging] = useState({ state: false, progress: 0, action: "" });
    const { usePrincipalAlert, usePrincipalLoading } = usePrincipal();
    const { showAlert, } = usePrincipalAlert;
    const { showSpinner, hideSpinner } = usePrincipalLoading;
    const { createReport, resetFlags, creating, updateReport, error } = useReportsStore();
    const { updateBackId } = useReportBuilderStore();
    const { all, updateQuery } = useQuery();
    const { user } = useAuth();


    useEffect(() => {
        if (savinging.state) {
            showSpinner({ message: savinging.action + " " + savinging.progress + "%" })
        }
    }, [savinging])

    useEffect(() => {
        if (creating) { setSavinging({ state: true, action: "Guardando reporte", progress: 0, }); return; }
        setSavinging({ state: false, action: "", progress: 0 });
    }, [creating]);

    useEffect(() => {
        if (error) ShowError("Ocurrio un error al guardar el reporte ", String(error))

    }, [error])

    const SaveImages = async (
        images: Activities[],
        folderPath: string,
        progresperpicture: number
    ): Promise<Activities[]> => {
        const updatedImages = [...images]; // Copia segura para no mutar directamente el state

        for (let i = 0; i < updatedImages.length; i++) {
            const picture = updatedImages[i];

            // Solo subir si es base64
            if (picture.urlimage.startsWith("data:image")) {
                try {
                    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                    const uniqueTitle = `${picture.title}_${timestamp}`;

                    let blobToUpload: Blob;
                    try {
                        const optimized = await optimizeDataUrlToBlob(picture.urlimage, {
                            maxWidth: 1600,
                            maxHeight: 1600,
                            quality: 0.72,
                            preferWebp: true,
                        });
                        blobToUpload = optimized.blob;
                    } catch (optError) {
                        console.warn("No se pudo optimizar la imagen, usando original", optError);
                        blobToUpload = base64ToBlob(picture.urlimage);
                    }

                    const uploadedImageUrl = await firebasestorage.uploadFile(
                        blobToUpload,
                        `${folderPath}/${uniqueTitle}`
                    );

                    // Actualiza progreso
                    setSavinging((prev) => ({
                        ...prev,
                        progress: prev.progress + progresperpicture,
                        action: "Procesando : " + picture.title,
                    }));

                    // Reemplaza directamente la URL en la copia del arreglo
                    updatedImages[i] = {
                        ...picture,
                        urlimage: uploadedImageUrl,
                    };
                } catch (error) {
                    ShowError(
                        "Ocurrió un error al subir la siguiente actividad: " + picture.title,
                        String(error)
                    );
                    throw error;
                }
            }
        }

        return updatedImages;
    };

    const calculateProgressPerImage = (totalPercentage: number, numberOfImages: number): number => {
        if (numberOfImages <= 0) return 0;
        return totalPercentage / numberOfImages;
    };

    const ShowError = (title: string, message: string) => {
        showAlert({
            type: 'error',
            variant: 'filled',
            title: title,
            description: message,
            autoCloseMs: 3000,
            showPrimaryButton: false,
            showSecondaryButton: false,

        });
        resetFlags();
        hideSpinner();
    }

    const ShowSucces = (reportId: string) => {
        showAlert({
            type: 'success',
            variant: 'filled',
            title: "Reporte guardado",
            description: "Se ha guardado el reporte correctamente",
            autoCloseMs: 3000,
            showPrimaryButton: false,
            showSecondaryButton: false,
        });
        updateBackId(reportId);
        updateQuery({ newReport: null, currentStep: null, frontId: null, reportId: reportId });
        hideSpinner();
        resetFlags();
    }

    const SaveReport = async (report: ReportView) => {
        const reportTosave = { ...report }
        showSpinner({ message: 'Guardando reporte...' });
        if (!firebasestorage.storage) {
            ShowError("Error de Firebase", "No se han cargado correctamente las configuraciones de Firebase, reinicie la aplicación, si el problema persiste contacte con soporte");
            return;
        }
        setSavinging({ state: true, progress: 0, action: "Empezando carga de Actividades" });
        const DirectoryBase = isProduction() ? "Produccion" : "Sandbox"
        const ImagesPath = DirectoryBase + `/Proyects/${all?.id}/Reports/${report?.type}/${report?.reportcategories?.id}/${report.front_identifier}/`
        const EmployeeSign: Activities[] = [{ title: "Firma del empleado", date: "", description: "", urlimage: report?.employeesignurl }]
        const ClientSignature: Activities[] = [{ title: "Firma del cliente", date: "", description: "", urlimage: report?.clientsign?.url ?? "" }]
        try {
            if (report?.activities.length > 0) reportTosave.activities = await SaveImages(report?.activities, ImagesPath + "Actividades", calculateProgressPerImage(50, report?.activities.length));
            if (report?.maps.length > 0) reportTosave.maps = await SaveImages(report?.maps, ImagesPath + "Mapas de trabajo", calculateProgressPerImage(10, report?.maps.length));
            if (report?.employeesignurl) { const employeesign = await SaveImages(EmployeeSign, ImagesPath + "Firmas", calculateProgressPerImage(10, 1)); reportTosave.employeesignurl = employeesign[0]?.urlimage ?? "" }
            if (report?.clientsign?.url) { const clientsign = await SaveImages(ClientSignature, ImagesPath + "Firmas", calculateProgressPerImage(10, 1)); reportTosave.clientsign.url = clientsign[0]?.urlimage ?? "" }
            if (!reportTosave?.proyect.id) reportTosave.proyect.id = String(all?.id) || ""
            if (!reportTosave?.employe?.employee_id) reportTosave.employe.employee_id = user?.idEmployee || ""
            if (!reportTosave?.workposition.workposition_id) reportTosave.workposition.workposition_id = user?.idWorkPosition || ""
            if (!reportTosave?.datecreate) reportTosave.datecreate = currentDate();
        } catch (error) {
            ShowError("Error desconocido", String(error));
            setSavinging({ state: false, progress: 0, action: "" });
        }
        setSavinging(prev => ({ ...prev, progress: 90, action: "Finalizando proceso de registro" }));
        if (report?.id) {
            const reportUpdated = await updateReport(reportTosave);
            if (reportUpdated) ShowSucces(report.id);
            return;
        }
        const reportSaved = await createReport(reportTosave);
        if (reportSaved) ShowSucces(reportSaved?.id);

    }

    return { SaveReport }
}

export default useReportSaver
