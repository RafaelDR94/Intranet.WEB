'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import type { ManagementDocumentTableRow } from '@/app/mappings/documents/documents.types'

import DocIcon from '@/assets/icons/Docs/page.svg'

import { useManagementDocuments } from './hooks/useManagementDocuments'

const ManagementDocuments = () => {
  const router = useRouter()
  const { rows, loading, error, refresh } = useManagementDocuments()

  console.log('rows ', rows);
  

  const columns: ColumnDefinition<ManagementDocumentTableRow>[] = [
    {
      key: 'name',
      label: 'FORMATO',
      render: (row) => (
          <DocIcon className="h-8 w-8 text-primary-400" aria-hidden />
      ),
    },
    {
      key: 'date',
      label: 'FECHA',
      render: (row) => row.date || '',
    },
    { key: 'code', label: 'CLAVE' },
    {
      key: 'description',
      label: 'DESCRIPCIÓN',
    },
    { key: 'documentType', label: 'TIPO' },
  ]

  return (
    <section className="space-y-8">
      <DataTable<ManagementDocumentTableRow>
        tables={[
          {
            title: '',
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
              variant="solid"
              hideIcon
              onClick={() => router.push('/main-page/humanresources/documents/documentregistry')}
            >
              Nuevo Documentos
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

export default ManagementDocuments
