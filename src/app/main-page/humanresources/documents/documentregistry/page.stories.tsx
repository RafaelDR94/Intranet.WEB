import React, { useEffect } from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { PathnameContext, SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'

import DocumentRegistry from './page'

import type { ManagementDocument } from '@/app/mappings/documents/documents.types'
import type { DocumentTypeSummary } from '@/app/mappings/documents/documents.types'
import { FirebaseContext } from '@/app/context/FirebaseContext/FirebaseContext'
import { PrincipalProvider } from '@/app/context/PrincipalContext/PrincipalContext'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'
import { useDocumentTypesStore } from '@/app/stores/useDocumentTypesStore/useDocumentTypesStore'
import { useDepartmentsStore } from '@/app/stores/useDepartmentsStore/useDepartmentsStore'

type AppRouterInstance = React.ContextType<typeof AppRouterContext>

type StoryProvidersProps = {
  children: React.ReactNode
  searchParams?: URLSearchParams
  initialDocuments?: ManagementDocument[]
}

const mockRouter: AppRouterInstance = {
  back: () => action('router.back')(),
  forward: () => action('router.forward')(),
  push: (href: string) => action('router.push')(href),
  replace: (href: string) => action('router.replace')(href),
  refresh: () => action('router.refresh')(),
  prefetch: async (href: string) => action('router.prefetch')(href),
}

const documentTypes: DocumentTypeSummary[] = [
  {
    document_type_id: 'type-1',
    name: 'FORMATO',
    description: 'FORMATO',
    is_active: true,
  },
  {
    document_type_id: 'type-2',
    name: 'MANUAL',
    description: 'MANUAL',
    is_active: true,
  },
]

const departments = [
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
]

const firebaseValue = {
  firebasestorage: {
    uploadFile: async (file: File, key: string) => {
      action('uploadFile')({ name: file.name, key })
      return `https://storage.example.com/${key}`
    },
  },
}

const DocumentRegistryStoryProviders: React.FC<StoryProvidersProps> = ({
  children,
  searchParams,
  initialDocuments = [],
}) => {
  useEffect(() => {
    const previousDocumentsState = useDocumentsStore.getState()
    const previousDocumentTypesState = useDocumentTypesStore.getState()
    const previousDepartmentsState = useDepartmentsStore.getState()

    useDocumentsStore.setState({
      ...previousDocumentsState,
      documents: initialDocuments,
      managementDocuments: initialDocuments.filter((doc) => doc.management),
      loading: false,
      successGet: true,
      deletingDocument: false,
      successDeleteDocument: false,
      error: undefined,
      fetchDocuments: async (force?: boolean) => {
        action('fetchDocuments')(Boolean(force))
        return Promise.resolve()
      },
      deleteDocument: previousDocumentsState.deleteDocument,
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
    <AppRouterContext.Provider value={mockRouter}>
      <PathnameContext.Provider value="/main-page/humanresources/documents/documentregistry">
        <SearchParamsContext.Provider value={searchParams ?? new URLSearchParams()}>
          <FirebaseContext.Provider value={firebaseValue as any}>
            <PrincipalProvider>
              {children}
            </PrincipalProvider>
          </FirebaseContext.Provider>
        </SearchParamsContext.Provider>
      </PathnameContext.Provider>
    </AppRouterContext.Provider>
  )
}

const meta: Meta<typeof DocumentRegistry> = {
  title: 'HumanResources/Documents/DocumentRegistryPage',
  component: DocumentRegistry,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta

type Story = StoryObj<typeof DocumentRegistry>

export const NewDocument: Story = {
  render: () => (
    <DocumentRegistryStoryProviders>
      <div data-theme="light" className="min-h-screen bg-gray-10 p-4">
        <DocumentRegistry />
      </div>
    </DocumentRegistryStoryProviders>
  ),
}

const existingDocument: ManagementDocument = {
  document_id: 'doc-1',
  name: 'Manual de políticas',
  code: 'MG-001',
  description: 'Procedimientos internos para gerencia.',
  document_type: {
    document_type_id: 'type-2',
    name: 'MANUAL',
    description: 'MANUAL',
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
}

export const EditDocument: Story = {
  render: () => (
    <DocumentRegistryStoryProviders
      searchParams={new URLSearchParams('documentId=doc-1')}
      initialDocuments={[existingDocument]}
    >
      <div data-theme="dark" className="min-h-screen bg-gray-140 p-4 text-white">
        <DocumentRegistry />
      </div>
    </DocumentRegistryStoryProviders>
  ),
}
