'use client'
import React, { useMemo, useState } from 'react'
import XMLIcon from '@/assets/icons/Docs/privacy policy.svg'
import PDFIcon from '@/assets/icons/Docs/page.svg'
import { ColumnDefinition } from '@/app/components/DataTable/types'
import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { Label } from '@/app/components/Label/Label'
import SideMenu from './components/SideMenu'
import Invoices from '@/app/main-page/request/invoices/page'
import { InvoicesProvider } from '../invoices/context/InvoicesContext'
export type HistoryRow = {
  id: string
  project: string
  requestCode: string
  status: 'valido' | 'invalido' | 'prohibido'
  xml: string
  pdf: string
}

const PersonalInvoicesHistory = () => {
  const [panelOpen, setPanelOpen] = useState(false)
  const [selected, setSelected] = useState<HistoryRow | null>(null)

  const columns: ColumnDefinition<HistoryRow>[] = [
    {
      key: 'files' as unknown as keyof HistoryRow,
      label: 'ARCHIVOS',
      render: (row) => (
        <div className="flex items-center gap-2 justify-center">
          <Button size="xsmall" variant="ghost" icon={XMLIcon} onClick={() => window.open(row.xml, '_blank')} />
          <Button size="xsmall" variant="ghost" icon={PDFIcon} onClick={() => window.open(row.pdf, '_blank')} />
        </div>
      ),
      cellClass: 'w-40 text-right',
      headerClass: 'w-40 text-right pr-10',
    },
    { key: 'project', label: 'PROYECTO' },
    { key: 'requestCode', label: 'CÓDIGO DE SOLICITUD' },
    {
      key: 'status',
      label: 'ESTATUS',
      render: (row) => <Label type={row.status} text={row.status.toUpperCase()} />,
      cellClass: 'w-32',
      headerClass: 'w-32',
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
      cellClass: 'w-28 text-right',
      headerClass: 'w-28 text-right',
    },
  ]

  const data: HistoryRow[] = useMemo(
    () => [
      { id: '1', project: 'PY-PUE-DRONES-001', requestCode: 'FUE0012', status: 'prohibido', xml: '#', pdf: '#' },
      { id: '2', project: 'PY-PUE-DRONES-001', requestCode: 'FUE0012', status: 'invalido', xml: '#', pdf: '#' },
      { id: '3', project: 'PY-PUE-DRONES-001', requestCode: 'FUE0012', status: 'valido', xml: '#', pdf: '#' },
      { id: '4', project: 'PY-PUE-DRONES-001', requestCode: 'FUE0012', status: 'valido', xml: '#', pdf: '#' },
      { id: '5', project: 'PY-PUE-DRONES-001', requestCode: 'FUE0012', status: 'invalido', xml: '#', pdf: '#' },
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
              defaultSortKey: 'project',
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
              defaultSortKey: 'project',
              defaultSortDirection: 'asc',
            },
          ]}
        />
      </div>
      <InvoicesProvider>
        <SideMenu panelOpen={panelOpen} setPanelOpen={setPanelOpen} selected={selected} />
      </InvoicesProvider>

      {/* Details Panel */}
      
    </>
  )
}

export default PersonalInvoicesHistory
