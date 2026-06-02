import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ManagementDocument } from '@/app/mappings/documents/documents.types'

const fetchMock = vi.fn((): Promise<void> => Promise.resolve())
const fetchByUserMock = vi.fn((): Promise<void> => Promise.resolve())
const deleteMock = vi.fn()
let pathnameMock = '/main-page/request/documents/operationaldocuments'

const documents: ManagementDocument[] = [
  {
    document_id: '1',
    name: 'Código de proyectos DR',
    code: 'OP-001',
    description: 'Procedimiento operativo estándar',
    document_type: {
      document_type_id: 'type-1',
      name: 'FORMATO',
      description: 'FORMATO',
      is_active: true,
    },
    department: {
      department_id: 'dep-1',
      name: 'Contabilidad / Nómina',
      enterprise_id: 'ent-1',
      enterprice_name: 'DR',
    },
    departments: [
      {
        department_id: 'dep-1',
        name: 'Contabilidad / Nómina',
        enterprise_id: 'ent-1',
        enterprice_name: 'DR',
      },
      {
        department_id: 'dep-2',
        name: 'VISITAX',
        enterprise_id: 'ent-2',
        enterprice_name: 'DR',
      },
    ],
    management: false,
    route: 'https://example.com/document.pdf',
    extension: 'pdf',
    created_at: '2025-02-03T12:00:00',
  },
  {
    document_id: '2',
    name: 'Instructivo gerencial',
    code: 'MG-002',
    description: 'Documento gerencial',
    document_type: {
      document_type_id: 'type-2',
      name: 'GUÍA',
      description: 'GUÍA',
      is_active: true,
    },
    department: {
      department_id: 'dep-2',
      name: 'VISITAX',
      enterprise_id: 'ent-2',
      enterprice_name: 'DR',
    },
    departments: [
      {
        department_id: 'dep-2',
        name: 'VISITAX',
        enterprise_id: 'ent-2',
        enterprice_name: 'DR',
      },
    ],
    management: true,
    route: 'https://example.com/gerencial.pdf',
    extension: 'pdf',
    created_at: '2025-02-10T09:00:00',
  },
]

vi.mock('@/app/stores/useDocumentsStore/useDocumentsStore', () => ({
  useDocumentsStore: (selector: any) =>
    selector({
      documents,
      managementDocuments: documents.filter((doc) => doc.management),
      operationalDocuments: documents.filter((doc) => !doc.management),
      loading: false,
      successGet: true,
      error: undefined,
      fetchDocumentsByUser: fetchByUserMock,
      fetchDocuments: fetchMock,
      deleteDocument: deleteMock,
      deletingDocument: false,
      successDeleteDocument: false,
      reset: vi.fn(),
      resetFlags: vi.fn(),
    }),
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: { idUser: 'user-1' },
  }),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameMock,
}))

import { useOperationalDocuments } from './useOperationalDocuments'

describe('useOperationalDocuments hook', () => {
  beforeEach(() => {
    pathnameMock = '/main-page/request/documents/operationaldocuments'
    fetchMock.mockClear()
    fetchByUserMock.mockClear()
    deleteMock.mockClear()
  })

  it('maps non management documents into table rows and triggers fetch', async () => {
    const { result } = renderHook(() => useOperationalDocuments())

    await waitFor(() => {
      expect(fetchByUserMock).toHaveBeenCalledWith('user-1', true)
    })

    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0].name).toBe('Código de proyectos DR')
    expect(result.current.rows[0].documentType).toBe('FORMATO')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.successGet).toBe(true)
    expect(result.current.successDeleteDocument).toBe(false)
    expect(result.current.deleteDocument).toBe(deleteMock)
    expect(result.current.deletingDocument).toBe(false)
  })

  it('invokes fetchDocuments with force flag when refreshing the table', async () => {
    const { result } = renderHook(() => useOperationalDocuments())

    await waitFor(() => {
      expect(fetchByUserMock).toHaveBeenCalledTimes(1)
      expect(fetchByUserMock).toHaveBeenLastCalledWith('user-1', true)
    })

    fetchByUserMock.mockClear()

    await act(async () => {
      await result.current.refresh()
    })

    expect(fetchByUserMock).toHaveBeenCalledTimes(1)
    expect(fetchByUserMock).toHaveBeenCalledWith('user-1', true)
  })

  it('does not fetch operational documents while another documents tab is active', async () => {
    pathnameMock = '/main-page/request/documents/managementdocuments'

    renderHook(() => useOperationalDocuments())

    await waitFor(() => {
      expect(fetchByUserMock).not.toHaveBeenCalled()
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })
})
