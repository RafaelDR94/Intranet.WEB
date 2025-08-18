import { useState,useMemo } from "react";
import { HistoryRow } from "@/app/mappings/billinghistory/billinghistory.types";
import { Proyect } from "@/app/mappings/proyects/proyects.types";
const useHistory = () => {
    const [panelOpen, setPanelOpen] = useState(false)
    const [selected, setSelected] = useState<HistoryRow | null>(null)
    // Mock adaptado al nuevo tipo
    const data: HistoryRow[] = useMemo(
        () => [
            {
                id: '',
                billing_image_id: 'IMG-1',
                billingdocument_id: 'DOC-1',
                project: { id: 'PY-PUE-DRONES-001', name: 'Proyecto Drones Puebla' } as Proyect,
                requisitionkey: 'FUE0012',
                status: 'prohibido',
                xml: '',
                pdf: '',
                image: '/files/2025/08/IMG-1.jpg',
                comments: 'Clave de producto prohibida detectada.',
                dateCreate: '2025-08-01T10:12:00Z',
                certificationDate: '2025-08-02T15:30:00Z',
                uuid: 'UUID-1',
            },
            {
                id: '',
                billing_image_id: 'IMG-2',
                billingdocument_id: 'DOC-2',
                project: { id: 'PY-PUE-DRONES-001', name: 'Proyecto Drones Puebla' } as unknown as Proyect,
                requisitionkey: 'FUE0013',
                status: 'invalido',
                xml: '',
                pdf: '/files/2025/08/IMG-2.pdf',
                image: '/files/2025/08/IMG-2.jpg',
                comments: 'CFDI con RFC no válido.',
                dateCreate: '2025-08-03T09:05:00Z',
                certificationDate: '2025-08-04T12:00:00Z',
                uuid: 'UUID-2',
            },
            {
                id: '',
                billing_image_id: 'IMG-3',
                billingdocument_id: 'DOC-3',
                project: { id: 'PY-CDMX-SEG-010', name: 'Seguridad CDMX 010' } as unknown as Proyect,
                requisitionkey: 'CDX0456',
                status: 'valido',
                xml: '/files/2025/08/IMG-3.xml',
                pdf: '/files/2025/08/IMG-3.pdf',
                image: '/files/2025/08/IMG-3.jpg',
                comments: 'Validación completa.',
                dateCreate: '2025-08-05T14:22:10Z',
                certificationDate: '2025-08-02T15:30:00Z',
                uuid: 'UUID-3',
            },
            {
                id: '',
                billing_image_id: 'IMG-4',
                billingdocument_id: 'DOC-4',
                project: { id: 'PY-CDMX-SEG-010', name: 'Seguridad CDMX 010' } as unknown as Proyect,
                requisitionkey: 'CDX0457',
                status: 'actualizado',
                xml: '/files/2025/08/IMG-4.xml',
                pdf: '/files/2025/08/IMG-4.pdf',
                image: '/files/2025/08/IMG-4.jpg',
                comments: 'Documento actualizado por proveedor.',
                dateCreate: '2025-08-08T08:40:00Z',
                certificationDate: '2025-08-02T15:30:00Z',
                uuid: 'UUID-4',
            },
            {
                id: '',
                billing_image_id: 'IMG-5',
                billingdocument_id: 'DOC-5',
                project: { id: 'PY-NL-MNT-021', name: 'Mantenimiento NL 021' } as unknown as Proyect,
                requisitionkey: 'NL2109',
                status: 'pendiente',
                xml: '/files/2025/08/IMG-5.xml',
                pdf: '/files/2025/08/IMG-5.pdf',
                image: '/files/2025/08/IMG-5.jpg',
                comments: 'En espera de validación contable.',
                dateCreate: '2025-08-10T11:15:30Z',
                certificationDate: '2025-08-02T15:30:00Z',
                uuid: 'UUID-5',
            },
        ],
        []
    )
    const rejected = data.filter((r) => r.status === 'prohibido' || r.status === 'invalido')
    return { panelOpen, setPanelOpen, selected, setSelected, rejected,data }


}
export default useHistory;