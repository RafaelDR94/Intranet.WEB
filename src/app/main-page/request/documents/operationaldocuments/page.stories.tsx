import React, { useEffect } from 'react'

import type { Meta, StoryObj } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { PathnameContext, SearchParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime'

import OperationalDocuments from './page'

import type { ManagementDocument } from '@/app/mappings/documents/documents.types'
import { useAuthStore } from '@/app/stores/useAuthStore/useAuthStore'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'

type AppRouterInstance = React.ContextType<typeof AppRouterContext>

const mockRouter: AppRouterInstance = {
  back: () => action('router.back')(),
  forward: () => action('router.forward')(),
  push: (href: string) => action('router.push')(href),
  replace: (href: string) => action('router.replace')(href),
  refresh: () => action('router.refresh')(),
  prefetch: async (href: string) => action('router.prefetch')(href),
}

const sampleDocuments: ManagementDocument[] = [
  {
    document_id: 'doc-op-1',
    name: 'Formato de Onboarding',
    code: 'OP-001',
    description: 'Checklist inicial de incorporación.',
    document_type: {
      document_type_id: 'type-1',
      name: 'FORMATO',
      description: 'FORMATO',
      is_active: true,
    },
    department: {
      department_id: 'dep-1',
      name: 'Capital Humano',
      enterprise_id: 'ent-1',
      enterprice_name: 'DR',
    },
    departments: [],
    management: false,
    route: 'https://example.com/onboarding.pdf',
    extension: 'pdf',
    created_at: '2025-01-10T12:00:00Z',
  },
  {
    document_id: 'doc-op-2',
    name: 'Guía de procesos',
    code: 'MG-200',
    description: 'Documento de referencia para gerencia.',
    document_type: {
      document_type_id: 'type-2',
      name: 'MANUAL',
      description: 'MANUAL',
      is_active: true,
    },
    department: {
      department_id: 'dep-2',
      name: 'Operaciones',
      enterprise_id: 'ent-1',
      enterprice_name: 'DR',
    },
    departments: [],
    management: true,
    route: 'https://example.com/guide.pdf',
    extension: 'pdf',
    created_at: '2025-02-01T09:00:00Z',
  },
]

const permissionsTree = {
  'main-page': {
    humanresources: {
      documents: {
        operationaldocuments: {
          Acces: true,
          Permissions: {
            details: true,
            delete: true,
          },
        },
      },
    },
  },
}

const OperationalDocumentsStoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const previousDocumentsState = useDocumentsStore.getState()
    const previousAuthState = useAuthStore.getState()

    useDocumentsStore.setState({
      ...previousDocumentsState,
      documents: sampleDocuments,
      managementDocuments: sampleDocuments.filter((doc) => doc.management),
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
        return Promise.resolve(true)
      },
    })

    useAuthStore.setState({
      ...previousAuthState,
      user: {
        ...(previousAuthState.user ?? ({} as any)),
        treeFirebase: JSON.stringify(permissionsTree),
      },
    })

    return () => {
      useDocumentsStore.setState(previousDocumentsState)
      useAuthStore.setState(previousAuthState)
    }
  }, [])

  return <>{children}</>
}

const meta: Meta<typeof OperationalDocuments> = {
  title: 'HumanResources/Documents/OperationalDocumentsPage',
  component: OperationalDocuments,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <AppRouterContext.Provider value={mockRouter}>
        <PathnameContext.Provider value="/main-page/humanresources/documents/operationaldocuments">
          <SearchParamsContext.Provider value={new URLSearchParams()}>
            <OperationalDocumentsStoryProvider>
              <Story />
            </OperationalDocumentsStoryProvider>
          </SearchParamsContext.Provider>
        </PathnameContext.Provider>
      </AppRouterContext.Provider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof OperationalDocuments>

export const LightMode: Story = {
  render: () => (
    <div data-theme="light" className="min-h-screen bg-gray-10 p-4">
      <OperationalDocuments />
    </div>
  ),
}

export const DarkMode: Story = {
  render: () => (
    <div data-theme="dark" className="min-h-screen bg-gray-140 p-4 text-white">
      <OperationalDocuments />
    </div>
  ),
}
