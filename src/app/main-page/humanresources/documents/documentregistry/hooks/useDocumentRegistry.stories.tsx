import React, { useEffect, useMemo } from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import useDocumentRegistry from './useDocumentRegistry'

import { FirebaseContext } from '@/app/context/FirebaseContext/FirebaseContext'
import { PrincipalProvider } from '@/app/context/PrincipalContext/PrincipalContext'
import type {
  DepartmentSummary,
  DocumentTypeSummary,
  ManagementDocument,
} from '@/app/mappings/documents/documents.types'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'
import { useDocumentTypesStore } from '@/app/stores/useDocumentTypesStore/useDocumentTypesStore'
import { useDepartmentsStore } from '@/app/stores/useDepartmentsStore/useDepartmentsStore'

const documentTypes: DocumentTypeSummary[] = [
  {
    document_type_id: 'type-1',
    name: 'POLÍTICA',
    description: 'Documento normativo',
    is_active: true,
  },
  {
    document_type_id: 'type-2',
    name: 'MANUAL',
    description: 'Manual de operación',
    is_active: true,
  },
  {
    document_type_id: 'type-3',
    name: 'FORMATO',
    description: 'Formato descargable',
    is_active: true,
  },
]

const departments: DepartmentSummary[] = [
  {
    department_id: 'dep-1',
    name: 'Capital Humano',
    enterprise_id: 'ent-1',
    enterprice_name: 'DR',
  },
  {
    department_id: 'dep-2',
    name: 'Operaciones',
    enterprise_id: 'ent-1',
    enterprice_name: 'DR',
  },
  {
    department_id: 'dep-3',
    name: 'Seguridad Industrial',
    enterprise_id: 'ent-1',
    enterprice_name: 'DR',
  },
]

const firebaseValue = {
  firebasestorage: {
    uploadFile: async (file: File, key: string) => {
      action('uploadFile')({ name: file.name, key })
      return `https://storage.example.com/${key}`
    },
  },
}

type DocumentRegistryHookProvidersProps = {
  children: React.ReactNode
  initialDocuments: ManagementDocument[]
}

const DocumentRegistryHookProviders: React.FC<DocumentRegistryHookProvidersProps> = ({
  children,
  initialDocuments,
}) => {
  useEffect(() => {
    const previousDocumentsState = useDocumentsStore.getState()
    const previousDocumentTypesState = useDocumentTypesStore.getState()
    const previousDepartmentsState = useDepartmentsStore.getState()

    const managementOnly = initialDocuments.filter((document) => document.management)

    useDocumentsStore.setState({
      ...previousDocumentsState,
      documents: initialDocuments,
      managementDocuments: managementOnly,
      loading: false,
      successGet: true,
      deletingDocument: false,
      successDeleteDocument: false,
      error: undefined,
      fetchDocuments: async (force?: boolean) => {
        action('fetchDocuments')(Boolean(force))
        return Promise.resolve()
      },
      deleteDocument: async (id: string) => {
        action('deleteDocument')(id)
        return Promise.resolve()
      },
    })

    useDocumentTypesStore.setState({
      ...previousDocumentTypesState,
      documentTypes,
      activeDocumentTypes: documentTypes.filter((type) => type.is_active),
      loading: false,
      successGet: true,
      error: undefined,
      fetchDocumentTypes: async () => {
        action('fetchDocumentTypes')()
        return Promise.resolve()
      },
    })

    useDepartmentsStore.setState({
      ...previousDepartmentsState,
      departments,
      loading: false,
      successGet: true,
      error: undefined,
      fetchDepartments: async () => {
        action('fetchDepartments')()
        return Promise.resolve()
      },
    })

    return () => {
      useDocumentsStore.setState(previousDocumentsState)
      useDocumentTypesStore.setState(previousDocumentTypesState)
      useDepartmentsStore.setState(previousDepartmentsState)
    }
  }, [initialDocuments])

  return (
    <FirebaseContext.Provider value={firebaseValue as any}>
      <PrincipalProvider>{children}</PrincipalProvider>
    </FirebaseContext.Provider>
  )
}

type DocumentRegistryHookArgs = {
  theme: 'light' | 'dark'
  documentId?: string
  initialDocuments: ManagementDocument[]
}

const DocumentRegistryHookContent: React.FC<{
  theme: 'light' | 'dark'
  documentId?: string
}> = ({ theme, documentId }) => {
  const {
    title,
    submitLabel,
    formReady,
    uploadedRoute,
    uploadingFile,
    formVersion,
    fields,
    responsiveLayoutMatrix,
    checklistDefinitions,
    setFormReady,
  } = useDocumentRegistry(documentId)

  const checklistOptions = useMemo(
    () => checklistDefinitions?.areas?.options ?? [],
    [checklistDefinitions],
  )

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
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>useDocumentRegistry</h2>
        <p style={{ margin: 0 }}>
          Hook responsable de preparar el formulario de registro de documentos y orquestar la
          carga a Firebase.
        </p>
      </header>

      <section style={{ display: 'grid', gap: '0.5rem', maxWidth: 460 }}>
        <strong>Estado resumido</strong>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            gap: '0.25rem 0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
          }}
        >
          <span>Título:</span>
          <span>{title}</span>
          <span>Acción primaria:</span>
          <span>{submitLabel}</span>
          <span>Formulario listo:</span>
          <span>{formReady ? 'Sí' : 'No'}</span>
          <span>Subiendo archivo:</span>
          <span>{uploadingFile ? 'Sí' : 'No'}</span>
          <span>Ruta cargada:</span>
          <span>{uploadedRoute || 'Pendiente'}</span>
          <span>Versión del formulario:</span>
          <span>{formVersion}</span>
        </div>
      </section>

      <section>
        <strong>Campos configurados ({fields.length})</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
          {fields.map((field) => (
            <li key={field.name} style={{ marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 600 }}>{field.label ?? field.name}</span>
              <span style={{ marginLeft: '0.5rem', color: 'var(--color-gray-80)' }}>
                ({field.type})
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <strong>Checklist de áreas ({checklistOptions.length})</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
          {checklistOptions.map((option) => (
            <li key={option.value}>{option.label}</li>
          ))}
          {checklistOptions.length === 0 && <li>Sin opciones disponibles</li>}
        </ul>
      </section>

      <section>
        <strong>Matriz responsiva</strong>
        <pre
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem',
            backgroundColor: 'var(--color-gray-20)',
            borderRadius: '0.5rem',
            overflowX: 'auto',
          }}
        >
          {JSON.stringify(responsiveLayoutMatrix, null, 2)}
        </pre>
      </section>

      <section style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            action('setFormReady')(true)
            setFormReady(true)
          }}
          style={{
            backgroundColor: 'var(--color-success-500)',
            border: 'none',
            color: 'var(--color-white)',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          Marcar formulario listo
        </button>
        <button
          type="button"
          onClick={() => {
            action('setFormReady')(false)
            setFormReady(false)
          }}
          style={{
            backgroundColor: 'var(--color-warning-500)',
            border: 'none',
            color: 'var(--color-white)',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          Marcar formulario pendiente
        </button>
      </section>
    </div>
  )
}

const DocumentRegistryHookPreview: React.FC<DocumentRegistryHookArgs> = ({
  theme,
  documentId,
  initialDocuments,
}) => (
  <DocumentRegistryHookProviders initialDocuments={initialDocuments}>
    <DocumentRegistryHookContent theme={theme} documentId={documentId} />
  </DocumentRegistryHookProviders>
)

const registryDocuments: ManagementDocument[] = [
  {
    document_id: 'doc-1',
    name: 'Manual de políticas',
    code: 'MG-001',
    description: 'Procedimientos internos para gerencia.',
    document_type: {
      document_type_id: 'type-2',
      name: 'MANUAL',
      description: 'Manual de operación',
      is_active: true,
    },
    department: {
      department_id: 'dep-1',
      name: 'Capital Humano',
      enterprise_id: 'ent-1',
      enterprice_name: 'DR',
    },
    departments: [
      {
        department_id: 'dep-1',
        name: 'Capital Humano',
        enterprise_id: 'ent-1',
        enterprice_name: 'DR',
      },
    ],
    management: true,
    route: 'https://storage.example.com/HumanResources/DocumentRegistry/MG-001.pdf',
    extension: 'pdf',
    created_at: '2025-01-10T12:00:00Z',
    datecreated: '2025-01-10',
  },
  {
    document_id: 'doc-2',
    name: 'Procedimiento operativo',
    code: 'OP-050',
    description: 'Documento operativo disponible para todos los colaboradores.',
    document_type: {
      document_type_id: 'type-3',
      name: 'FORMATO',
      description: 'Formato editable',
      is_active: true,
    },
    department: {
      department_id: 'dep-2',
      name: 'Operaciones',
      enterprise_id: 'ent-1',
      enterprice_name: 'DR',
    },
    departments: [
      {
        department_id: 'dep-2',
        name: 'Operaciones',
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
    route: 'https://storage.example.com/HumanResources/DocumentRegistry/OP-050.docx',
    extension: 'docx',
    datecreated: '2025-02-05',
  },
]

const meta: Meta<typeof DocumentRegistryHookPreview> = {
  title: 'HumanResources/Documents/Hooks/useDocumentRegistry',
  component: DocumentRegistryHookPreview,
  argTypes: {
    theme: {
      control: { type: 'inline-radio' },
      options: ['light', 'dark'],
    },
    documentId: {
      control: 'text',
    },
  },
}

type Story = StoryObj<typeof DocumentRegistryHookPreview>

export const NuevoDocumento: Story = {
  render: (args) => <DocumentRegistryHookPreview {...args} />,
  args: {
    theme: 'light',
    initialDocuments: registryDocuments,
  },
}

export const EdicionDocumento: Story = {
  render: (args) => <DocumentRegistryHookPreview {...args} />,
  args: {
    ...NuevoDocumento.args!,
    theme: 'dark',
    documentId: 'doc-1',
  },
}

export default meta
