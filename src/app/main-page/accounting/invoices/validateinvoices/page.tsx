'use client'
import React, { useMemo, useState } from 'react'
import XMLIcon from '@/assets/icons/Docs/privacy policy.svg'
import PDFIcon from '@/assets/icons/Docs/page.svg'
import { ColumnDefinition } from '@/app/components/DataTable/types'
import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import DetailsPanelLayout from '@/app/components/DetailsPanelLayout/DetailsPanelLayout'

type Factura = {
  id: string
  rfc: string
  claveSat: string
  uuid: string
  fecha: string
  importe: number
  xml: string
  pdf: string
}

const ValidateInvoices = () => {
  // ---- state para details panel + comentario
  const [panelOpen, setPanelOpen] = useState(false)
  const [selected, setSelected] = useState<Factura | null>(null)
  const [comment, setComment] = useState('')

  const handleOpenDetails = (row: Factura) => {
    setSelected(row)
    setComment('')
    setPanelOpen(true)
  }

  const handleSaveComment = () => {
    if (!selected) return
    // TODO: reemplazar con API real
    console.log('Guardar comentario', { id: selected.id, comment })
    setPanelOpen(false)
  }

  const columnas: ColumnDefinition<Factura>[] = [
    {
      key: 'xml',
      label: 'XML',
      render: (row) => (
        <Button
          size="xsmall"
          onClick={() => window.open(row.xml, '_blank')}
          variant="ghost"
          icon={XMLIcon}
        />
      ),
      cellClass: 'w-12 text-center',
      headerClass: 'w-12  text-center',
    },
    {
      key: 'pdf',
      label: 'PDF',
      render: (row) => (
        <Button
          size="xsmall"
          onClick={() => window.open(row.pdf, '_blank')}
          variant="ghost"
          icon={PDFIcon}
        />
      ),
      cellClass: 'w-12  text-center',
      headerClass: 'w-12 text-center',
    },
    { key: 'rfc', label: 'RFC EMISOR' },
    { key: 'claveSat', label: 'CLAVE SAT' },
    { key: 'uuid', label: 'UUID' },
    { key: 'fecha', label: 'FECHA' },
    {
      key: 'importe',
      label: 'IMPORTE',
      render: (row) => `$${row.importe.toFixed(2)}`,
      cellClass: 'text-right',
      headerClass: 'text-right',
    },
    {
      key: 'acciones' as unknown as keyof Factura,
      headerRender: () => <span className="text-lg">⋯</span>,
      render: (row) => (
        <Button
          size="small"
          onClick={() => handleOpenDetails(row)}
          variant="ghost"
          hideIcon
        >
          Ver Detalles
        </Button>
      ),
      cellClass: 'w-28 text-right',
      headerClass: 'w-28 text-right',
    },
  ]

  const datosFactura: Factura[] = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => {
        const fecha = new Date()
        fecha.setDate(fecha.getDate() - i)
        return {
          id: `${i + 1}`,
          rfc: `RFC${1000 + i}`,
          claveSat: `9010150${i}`,
          uuid:
            typeof crypto !== 'undefined' && 'randomUUID' in crypto
              ? crypto.randomUUID()
              : `UUID-${i + 1}`,
          fecha: fecha.toISOString().split('T')[0],
          importe: parseFloat((100 + i * 23.75).toFixed(2)),
          xml: `https://example.com/factura-${i + 1}.xml`,
          pdf: `https://example.com/factura-${i + 1}.pdf`,
        }
      }),
    []
  )

  return (
    <>
      <div className="space-y-8 overflow-auto">
        <DataTable
          onSearchChange={(val) => console.log('Buscar nuevas:', val)}
          onCalendarClick={() => console.log('Calendario nuevas')}
          onFilterClick={() => console.log('Filtro nuevas')}
          onSearch={() => console.log('Validar nuevas')}
          actionLabel="Validar Facturas"
                enablePagination={false}
          tables={[
            {
              data: datosFactura,
              columns: columnas,
              enableSelection: true,
              title: 'Nuevas Facturas',
              enableCollaps: true,
              defaultSortKey: 'fecha',
              defaultSortDirection: 'desc',
            },
          ]}
        />

        <DataTable
          onSearchChange={(val) => console.log('Buscar pendientes:', val)}
          onCalendarClick={() => console.log('Calendario pendientes')}
          onFilterClick={() => console.log('Filtro pendientes')}
          onSearch={() => console.log('Validar pendientes')}
          actionLabel="Validar Facturas"
          tables={[
            {
              data: datosFactura,
              columns: columnas,
              enableSelection: true,
              title: 'Facturas Pendientes por Validar',
              enableCollaps: true,
              defaultSortKey: 'fecha',
              defaultSortDirection: 'desc',
            },
          ]}
        />
      </div>

      {/* Panel de Detalles con Comentario */}
      <DetailsPanelLayout
        open={panelOpen}
        withinContainer
        onClose={() => setPanelOpen(false)}
        leftLabel={selected ? `UUID: ${selected.uuid}` : undefined}
        rightLabel={selected ? `Importe: $${selected.importe.toFixed(2)}` : undefined}
        actionButton={
          <div className="flex items-center gap-2">
            <Button
              size="large"
              variant="ghost"
              icon={XMLIcon}
              onClick={() => selected && window.open(selected.xml, '_blank')}
            >
              XML
            </Button>
            <Button
              size="large"
              variant="ghost"
              icon={PDFIcon}
              onClick={() => selected && window.open(selected.pdf, '_blank')}
            >
              PDF
            </Button>
          </div>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="text-s2 font-semibold">Detalle de la Factura</div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="text-b3">
                <span className="text-gray-70">RFC Emisor:</span> {selected.rfc}
              </div>
              <div className="text-b3">
                <span className="text-gray-70">Clave SAT:</span> {selected.claveSat}
              </div>
              <div className="text-b3">
                <span className="text-gray-70">Fecha:</span> {selected.fecha}
              </div>
              <div className="text-b3">
                <span className="text-gray-70">Importe:</span> ${selected.importe.toFixed(2)}
              </div>
            </div>

            {/* Comentarios (como en tu SAT) */}
            <div className="pt-2">
              <div className="text-s2 font-semibold mb-2">Comentarios:</div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Agregar comentario"
                className="w-full min-h-28 rounded-md border border-gray-30 bg-white-100 text-b3 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-50"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  size="medium"
                  variant="outline"
                  hideIcon
                  onClick={handleSaveComment}
                  disabled={!comment.trim()}
                >
                  Guardar Comentario
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-70 text-b3">Selecciona una factura para ver detalles.</div>
        )}
      </DetailsPanelLayout>
    </>
  )
}

export default ValidateInvoices
