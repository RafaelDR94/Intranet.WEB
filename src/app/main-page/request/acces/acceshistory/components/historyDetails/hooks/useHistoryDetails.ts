
import { useAccesRequirementStore } from "@/app/stores/useAccesRequirementStore/useAccesRequirementStore";
import { useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import useQuery from "@/app/hooks/useQuery/useQuery";
import { LabelType } from "@/app/components/Label/types";
import { usePrincipal } from "@/app/context/PrincipalContext/PrincipalContext";
import { useRouter } from "next/navigation";
import useAccessPdf from "./useAccesDocuments";
const useHistoryDetails = () => {
    const router = useRouter();
    const { generateAccessPdf } = useAccessPdf();
    const { usePrincipalLoading } = usePrincipal();
    const [activeNav, setActiveNav] = useState("information");
    const { showSpinner, hideSpinner } = usePrincipalLoading
    const { all } = useQuery();
    const idAcces = all.idAcces;
    const mapStatusToLabel = (status?: string): LabelType => {
        const s = (status || '').toLowerCase();
        if (s.includes('aprobada')) return 'valido';
        if (s.includes('rechaz')) return 'rechazado';
        if (s.includes('enviad')) return 'actualizado';
        if (s.includes('finaliz')) return 'restringido';
        if (s.includes('pendiente')) return 'pendiente';
        if (s.includes('cancel')) return 'sin-factura';
        if (s.includes('incidencia')) return 'vale-rosa';
        return 'actualizado';
    }
    const { fetchAccesRequirementById, currentAcces, generateTemplate } = useAccesRequirementStore((s) => ({
        fetchAccesRequirementById: s.fetchAccesRequirementById,
        currentAcces: s.current,
        generateTemplate: s.generateTemplate
    }), shallow);

    const handleDownloadZIP = async () => {
        if (!currentAcces) return;
        showSpinner(({ message: "Descargando archivo" }));
        try {

            await generateAccessPdf(currentAcces, (url: string) => {
                // Crear enlace invisible
                const link = document.createElement("a");
                link.href = url;
                link.download = `SolicitudAcceso_${currentAcces.id}.pdf`; // nombre del archivo
                link.style.display = "none";

                document.body.appendChild(link);
                link.click();        // 🔥 Forzar descarga inmediata
                document.body.removeChild(link);

                // Liberar memoria opcionalmente:
                setTimeout(() => URL.revokeObjectURL(url), 5000);
            }, "DR");
            const response: any = await generateTemplate(currentAcces.id);

            // 1) Si es URL directa, abrir/descargar
            if (typeof response === 'string' && response.startsWith('http')) {
                const a = document.createElement('a');
                a.href = response;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.click();
                return;
            }

            // 2) Si viene como arreglo de bytes (bits)
            let bytes: Uint8Array | null = null;
            if (Array.isArray(response)) {
                bytes = new Uint8Array(response as number[]);
            } else if (response?.bytes && Array.isArray(response.bytes)) {
                bytes = new Uint8Array(response.bytes as number[]);
            } else if (response?.data && Array.isArray(response.data)) {
                bytes = new Uint8Array(response.data as number[]);
            }

            if (bytes) {
                const blob = new Blob([bytes as any], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `acceso_${currentAcces.id}_finalizacion.xlsx`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                return;
            }

            // 3) Si viene como base64 plain
            if (typeof response === 'string') {
                const b64 = response.includes(',') ? response.split(',')[1] : response;
                try {
                    const bin = atob(b64);
                    const len = bin.length;
                    const buf = new Uint8Array(len);
                    for (let i = 0; i < len; i++) buf[i] = bin.charCodeAt(i);
                    const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `acceso_${currentAcces.id}_finalizacion.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                    return;
                } catch { /* no válido, caerá al alert */ }
            }

            // Si no se pudo interpretar
            console.warn('Respuesta de template no reconocida', response);
            alert('No se pudo descargar el archivo. Formato de respuesta no reconocido.');
        } finally {
            hideSpinner();
        }
    }
    const handleActiveChange = (active: string) => {
        setActiveNav(active);
    }
    useEffect(() => {
        if (idAcces && !currentAcces) {
            fetchAccesRequirementById(String(idAcces));
        }
    }, [idAcces, fetchAccesRequirementById]);

    const handleEditInformation = () => {
        if (!currentAcces?.id) return;
        if (activeNav == "information") router.push(
            `/main-page/request/acces/generateacces/?idAcces=${encodeURIComponent(currentAcces.id)}&mode=edit`,
        );
        else {
            router.push(
                `/main-page/request/acces/generateacces/?idAcces=${encodeURIComponent(currentAcces.id)}&force=true`,
            );
        }


    };

    const canSeeEditButton = () => {
        if (activeNav == "comments") return false
        if (currentAcces?.status == "A finalizado"
            || currentAcces?.status == "A rechazado"
            || currentAcces?.status == "Cancelada"
            || currentAcces?.status == "Enviada"
            || currentAcces?.status == "I Aprobada"
            || currentAcces?.status == "Incidencia"
        ) return false
        else return true

    }

    return { currentAcces, mapStatusToLabel, handleDownloadZIP, handleEditInformation, handleActiveChange, canSeeEditButton };
}
export default useHistoryDetails;
