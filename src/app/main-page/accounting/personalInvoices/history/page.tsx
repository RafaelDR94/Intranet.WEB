'use client'
import React, { useMemo, useState } from 'react'
import XMLIcon from '@/assets/icons/Docs/privacy policy.svg'
import PDFIcon from '@/assets/icons/Docs/page.svg'
import ImageIcon from '@/assets/icons/Fotos y Videos/media-image.svg'
import { ColumnDefinition } from '@/app/components/DataTable/types'
import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { Label } from '@/app/components/Label/Label'
import SideMenu from './components/SideMenu'
import { Proyect } from '@/app/mappings/proyects/proyects.types'
import { InvoicesProvider } from '../invoices/context/InvoicesContext'
import { HistoryRow } from '@/app/mappings/billinghistory/billinghistory.types'




const PersonalInvoicesHistory = () => {
  const [panelOpen, setPanelOpen] = useState(false)
  const [selected, setSelected] = useState<HistoryRow | null>(null)
  const columns: ColumnDefinition<HistoryRow>[] = [
    {
      key: 'billing_image_id',
      label: 'ID Imagen',
      invisible: true,
    },
    {
      key: 'billingdocument_id',
      label: 'ID Documento',
      invisible: true,
    },
    {
      key: 'project',
      label: 'PROYECTO',
      render: (row) => <span>{row.project?.name ?? row.project?.id}</span>,
    },
    {
      key: 'requisitionkey',
      label: 'CÓDIGO DE SOLICITUD',
    },
    {
      key: 'status',
      label: 'ESTATUS',
      render: (row) => <Label type={row.status} text={row.status.toUpperCase()} />,
    },
    {
      key: 'xml',
      label: 'XML',
      invisible: true,
    },
    {
      key: 'pdf',
      label: 'PDF',
      invisible: true,
    },
    {
      key: 'image',
      label: 'IMAGEN',
      invisible: true,
    },
    {
      key: 'comments',
      label: 'COMENTARIOS',
      invisible: true,
    },
    {
      key: 'dateCreate',
      label: 'FECHA DE CREACIÓN',
    },
    {
      key: 'files' as unknown as keyof HistoryRow,
      label: 'ARCHIVOS',
      render: (row) => (
        <div className="flex items-center gap-2 justify-center">
          {row.xml && (
            <Button size="xsmall" variant="ghost" icon={XMLIcon} onClick={() => window.open(row.xml, '_blank')} />
          )}
          {row.pdf && (
            <Button size="xsmall" variant="ghost" icon={PDFIcon} onClick={() => window.open(row.pdf, '_blank')} />
          )}
          {row.image && (
            <Button size="xsmall" variant="ghost" icon={ImageIcon} onClick={() => window.open(row.image, '_blank')} />
          )}
        </div>
      ),
    },
    {
      key: 'details' as unknown as keyof HistoryRow,
      label: 'DETALLES',
      render: (row) => (
        <Button
          size="small"
          variant="ghost"
          hideIcon
          onClick={() => {
            setSelected(row)
            setPanelOpen(true)
          }}
        >
          Ver Detalle
        </Button>
      ),
    },
  ]

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

  return (
    <>
      <div className="space-y-8 overflow-auto">
        <DataTable
          onSearchChange={(val) => console.log('Buscar rechazadas:', val)}
          onCalendarClick={() => console.log('Calendario rechazadas')}
          onFilterClick={() => console.log('Filtro rechazadas')}
          onSearch={() => console.log('Descargar rechazadas')}
          actionLabel="Descargar"
          tables={[
            {
              data: rejected,
              columns,
              enableSelection: true,
              title: 'Rechazadas',
              enableCollaps: true,
              defaultSortKey: "dateCreate",
              defaultSortDirection: 'asc',
            },
          ]}
        />

        <DataTable
          onSearchChange={(val) => console.log('Buscar historial:', val)}
          onCalendarClick={() => console.log('Calendario historial')}
          onFilterClick={() => console.log('Filtro historial')}
          onSearch={() => console.log('Descargar historial')}
          actionLabel="Descargar"
          tables={[
            {
              data,
              columns,
              enableSelection: true,
              title: 'Historial',
              enableCollaps: true,
              defaultSortKey: 'dateCreate',
              defaultSortDirection: 'asc',
            },
          ]}
        />
      </div>

      <InvoicesProvider>
        <SideMenu panelOpen={panelOpen} setPanelOpen={setPanelOpen} selected={selected} />
      </InvoicesProvider>
    </>
  )
}

export default PersonalInvoicesHistory
