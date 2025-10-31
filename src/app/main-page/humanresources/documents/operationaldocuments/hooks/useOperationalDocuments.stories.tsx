import React, { useCallback, useEffect, useMemo, useRef } from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { useOperationalDocuments } from './useOperationalDocuments'

import type { ManagementDocument } from '@/app/mappings/documents/documents.types'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'

const operationalDocuments: ManagementDocument[] = [
  {
    document_id: 'op-1',
    name: 'Procedimiento de seguridad',
    code: 'OP-001',
    description: 'Lineamientos operativos para emergencias.',
    document_type: {
      document_type_id: 'type-1',
      name: 'PROCEDIMIENTO',
      description: 'Procedimiento estándar',
      is_active: true,
    },
    department: {
      department_id: 'dep-1',
      name: 'Operaciones',
      enterprise_id: 'ent-1',
      enterprice_name: 'DR',
    },
    departments: [
      {
        department_id: 'dep-1',
        name: 'Operaciones',
        enterprise_id: 'ent-1',
        enterprice_name: 'DR',
      },
    ],
    management: false,
    route: 'https://storage.example.com/HumanResources/OperationalDocuments/OP-001.pdf',
    extension: 'pdf',
    created_at: '2025-01-10T12:00:00Z',
    updated_at: '2025-01-15T09:00:00Z',
    published_at: '2025-01-16T09:00:00Z',
    datecreated: '2025-01-10',
  },
  {
    document_id: 'op-2',
    name: 'Checklist de mantenimiento',
    code: 'OP-002',
    description: 'Lista de verificación diaria para equipos críticos.',
    document_type: {
      document_type_id: 'type-2',
      name: 'LISTA',
      description: 'Lista de verificación',
      is_active: true,
    },
    department: {
      department_id: 'dep-2',
      name: 'Mantenimiento',
      enterprise_id: 'ent-1',
      enterprice_name: 'DR',
    },
    departments: [
      {
        department_id: 'dep-2',
        name: 'Mantenimiento',
        enterprise_id: 'ent-1',
        enterprice_name: 'DR',
      },
      {
        department_id: 'dep-3',
        name: 'Seguridad Industrial',
        enterprise_id: 'ent-1',
        enterprice_name: 'DR',
      },
    ],
    management: false,
    route: 'https://storage.example.com/HumanResources/OperationalDocuments/OP-002.xlsx',
    extension: 'xlsx',
    datecreated: '2025-02-03',
  },
]

type OperationalDocumentsHookArgs = {
  theme: 'light' | 'dark'
  documents: ManagementDocument[]
  loading: boolean
  error?: string
  successGet: boolean
  deletingDocument: boolean
  successDeleteDocument: boolean
}

const OperationalDocumentsHookPreview: React.FC<OperationalDocumentsHookArgs> = ({
  theme,
  documents,
  loading,
  error,
  successGet,
  deletingDocument,
  successDeleteDocument,
}) => {
  const previousStateRef = useRef(useDocumentsStore.getState())
  const rowsSummary = useMemo(
    () =>
      documents.map((document) => ({
        id: document.document_id,
        name: document.name,
        code: document.code,
        department:
          document.department?.name ?? document.departments[0]?.name ?? 'Sin asignar',
        type: document.document_type?.name ?? 'N/D',
      })),
    [documents],
  )

  const fetchDocumentsMock = useCallback(
    async (force?: boolean) => {
      action('fetchDocuments')(Boolean(force))
      useDocumentsStore.setState((state) => ({
        ...state,
        documents,
        managementDocuments: documents.filter((document) => document.management),
        loading: false,
        successGet: true,
      }))
    },
    [documents],
  )

  const deleteDocumentMock = useCallback(async (id: string) => {
    action('deleteDocument')(id)
  }, [])

  useEffect(() => {
    return () => {
      useDocumentsStore.setState(previousStateRef.current)
    }
  }, [])

  useEffect(() => {
    useDocumentsStore.setState((state) => ({
      ...state,
      documents,
      managementDocuments: documents.filter((document) => document.management),
      loading,
      error,
      successGet,
      deletingDocument,
      successDeleteDocument,
      fetchDocuments: fetchDocumentsMock,
      deleteDocument: deleteDocumentMock,
    }))
  }, [
    documents,
    loading,
    error,
    successGet,
    deletingDocument,
    successDeleteDocument,
    fetchDocumentsMock,
    deleteDocumentMock,
  ])

  const { rows, refresh, deleteDocument: deleteDocumentFromHook } = useOperationalDocuments()

  return (
    <div
      data-theme={theme}
      style={{
        backgroundColor: 'var(--color-gray-10)',
        color: 'var(--color-foreground)',
        minHeight: '100vh',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <header>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          useOperationalDocuments
        </h2>
        <p style={{ margin: 0 }}>
          Vista previa del estado derivado del store y de las filas mapeadas que consume la
          tabla operativa.
        </p>
      </header>

      <section style={{ display: 'grid', gap: '0.5rem', maxWidth: 420 }}>
        <strong>Estado del store</strong>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '0.25rem 0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
          }}
        >
          <span>Cargando:</span>
          <span>{loading ? 'Sí' : 'No'}</span>
          <span>Éxito GET:</span>
          <span>{successGet ? 'Sí' : 'No'}</span>
          <span>Eliminando:</span>
          <span>{deletingDocument ? 'Sí' : 'No'}</span>
          <span>Éxito eliminación:</span>
          <span>{successDeleteDocument ? 'Sí' : 'No'}</span>
          <span>Error:</span>
          <span>{error || 'Sin errores'}</span>
        </div>
      </section>

      <section style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            action('refresh')()
            void refresh()
          }}
          style={{
            backgroundColor: 'var(--color-primary-500)',
            border: 'none',
            color: 'var(--color-white)',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          Refrescar documentos
        </button>
        {rows[0] && (
          <button
            type="button"
            onClick={() => {
              action('deleteDocumentFromHook')(rows[0].id)
              void deleteDocumentFromHook(rows[0].id)
            }}
            style={{
              backgroundColor: 'var(--color-danger-500)',
              border: 'none',
              color: 'var(--color-white)',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Eliminar primero
          </button>
        )}
      </section>

      <section>
        <strong>Filas generadas ({rows.length})</strong>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '0.5rem',
          }}
        >
          <thead>
            <tr>
              {['ID', 'Nombre', 'Código', 'Departamento', 'Tipo'].map((column) => (
                <th
                  key={column}
                  style={{
                    textAlign: 'left',
                    padding: '0.5rem',
                    borderBottom: '1px solid var(--color-gray-30)',
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowsSummary.map((row) => (
              <tr key={row.id}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-gray-20)' }}>
                  {row.id}
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-gray-20)' }}>
                  {row.name}
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-gray-20)' }}>
                  {row.code}
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-gray-20)' }}>
                  {row.department}
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--color-gray-20)' }}>
                  {row.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

const meta: Meta<typeof OperationalDocumentsHookPreview> = {
  title: 'HumanResources/Documents/Hooks/useOperationalDocuments',
  component: OperationalDocumentsHookPreview,
  tags: ['autodocs'],
  argTypes: {
    theme: {
      control: { type: 'inline-radio' },
      options: ['light', 'dark'],
    },
  },
}

type Story = StoryObj<typeof OperationalDocumentsHookPreview>

export const Light: Story = {
  render: (args) => <OperationalDocumentsHookPreview {...args} />,
  args: {
    theme: 'light',
    documents: operationalDocuments,
    loading: false,
    error: undefined,
    successGet: true,
    deletingDocument: false,
    successDeleteDocument: false,
  },
}

export const Dark: Story = {
  render: (args) => <OperationalDocumentsHookPreview {...args} />,
  args: {
    ...Light.args!,
    theme: 'dark',
  },
}

export default meta
