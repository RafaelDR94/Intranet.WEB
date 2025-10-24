'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import type { ManagementDocumentTableRow } from '@/app/mappings/documents/documents.types'

import DocStarIcon from '@/assets/icons/Docs/doc-star.svg'

import { useOperationalDocuments } from './hooks/useOperationalDocuments'

const OperationalDocuments = () => {
  const router = useRouter()
  const { rows, loading, error, refresh } = useOperationalDocuments()

  const columns: ColumnDefinition<ManagementDocumentTableRow>[] = [
    {
      key: 'name',
      label: 'PORTADA',
      render: (row) => (
        <div className="flex items-center gap-3">
          <DocStarIcon className="h-8 w-8 text-primary-400" aria-hidden />
          <div className="flex flex-col">
            <span className="text-base font-semibold text-white">{row.name}</span>
            {row.extension && (
              <span className="text-xs uppercase text-neutral-300">{row.extension}</span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'FECHA',
      render: (row) => row.date || '—',
    },
    { key: 'code', label: 'CLAVE' },
    {
      key: 'description',
      label: 'DESCRIPCIÓN',
      cellClass: 'max-w-[240px] truncate',
    },
    { key: 'documentType', label: 'TIPO' },
    { key: 'department', label: 'DEPARTAMENTO' },
    {
      key: 'route',
      label: 'VER',
      render: (row) => (
        <Button
          size="small"
          variant="ghost"
          hideIcon
          disabled={!row.route}
          onClick={() => {
            if (!row.route) return
            window.open(row.route, '_blank', 'noopener')
          }}
        >
          Ver
        </Button>
      ),
    },
  ]

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold text-white">Documentos Operativos</h1>
        <p className="text-sm text-neutral-300">
          Accede a los formatos y lineamientos operativos que apoyan el trabajo diario del equipo.
        </p>
      </header>

      <DataTable<ManagementDocumentTableRow>
        tables={[
          {
            title: 'Listado de documentos',
            enableCollaps: false,
            data: rows,
            columns,
            defaultSortKey: 'name',
          },
        ]}
        textSize={{ mobile: 'c2', desktop: 'text-c2' }}
        enableInternalSearch
        searchableKeys={['name', 'code', 'description', 'documentType', 'department']}
        showCalendar={false}
        showFilter={false}
        showButton={false}
        showDownloadTable
        dateKey={(row) => row.rawDate ?? row.date}
        actionsRender={() => (
          <div className="flex w-full items-center justify-end gap-3">
            <Button
              size="medium"
              variant="ghost"
              hideIcon
              onClick={() => router.push('/main-page/humanresources/documents/documentregistry')}
            >
              Nuevo Documento
            </Button>
            <Button size="medium" hideIcon onClick={() => refresh()} disabled={loading}>
              Actualizar
            </Button>
          </div>
        )}
      />

      {loading && <p className="text-sm text-neutral-300">Cargando documentos…</p>}
      {error && !loading && (
        <p className="text-sm text-red-400">Ocurrió un error al cargar los documentos: {error}</p>
      )}
    </section>
  )
}

export default OperationalDocuments
