import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import type { ManagementDocument } from '@/app/mappings/documents/documents.types'

const fetchMock = vi.fn((): Promise<void> => Promise.resolve())
const deleteMock = vi.fn()
const replaceMock = vi.fn()
let pathnameMock = '/main-page/request/documents/managementdocuments'
let authUserMock: { isGerence?: boolean } | null = { isGerence: true }

const managementDocuments: ManagementDocument[] = [
  {
    document_id: '1',
    name: 'Manual de procesos',
    code: 'MG-001',
    description: 'Guía para procesos gerenciales',
    document_type: {
      document_type_id: 'type-1',
      name: 'FORMATO',
      description: 'FORMATO',
      is_active: true,
    },
    department: {
      department_id: 'dep-1',
      name: 'VISITAX',
      enterprise_id: 'ent-1',
      enterprice_name: 'DR',
    },
    departments: [
      {
        department_id: 'dep-1',
        name: 'VISITAX',
        enterprise_id: 'ent-1',
        enterprice_name: 'DR',
      },
    ],
    management: true,
    route: 'https://example.com/document.pdf',
    extension: 'pdf',
    created_at: '2025-10-24T12:00:00',
  },
]

vi.mock('@/app/stores/useDocumentsStore/useDocumentsStore', () => ({
  useDocumentsStore: (selector: any) =>
    selector({
      managementDocuments,
      documents: managementDocuments,
      operationalDocuments: [],
      loading: false,
      successGet: true,
      error: undefined,
      fetchDocuments: fetchMock,
      deleteDocument: deleteMock,
      deletingDocument: false,
      successDeleteDocument: false,
      reset: vi.fn(),
      resetFlags: vi.fn(),
    }),
}))

vi.mock('next/navigation', () => ({
  usePathname: () => pathnameMock,
  useRouter: () => ({ replace: replaceMock }),
}))

vi.mock('@/app/context/AuthContext/AuthContext', () => ({
  useAuth: () => ({
    user: authUserMock,
  }),
}))

import { useManagementDocuments } from './useManagementDocuments'

describe('useManagementDocuments hook', () => {
  beforeEach(() => {
    pathnameMock = '/main-page/request/documents/managementdocuments'
    authUserMock = { isGerence: true }
    fetchMock.mockClear()
    deleteMock.mockClear()
    replaceMock.mockClear()
  })

  it('maps store documents into table rows and triggers fetch', async () => {
    const { result } = renderHook(() => useManagementDocuments())

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0].name).toBe('Manual de procesos')
    expect(result.current.rows[0].documentType).toBe('FORMATO')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeUndefined()
    expect(result.current.successGet).toBe(true)
    expect(result.current.successDeleteDocument).toBe(false)
    expect(result.current.deleteDocument).toBe(deleteMock)
    expect(result.current.deletingDocument).toBe(false)
  })

  it('refreshes management documents forcing the fetch', async () => {
    const { result } = renderHook(() => useManagementDocuments())

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenLastCalledWith(true)
    })

    fetchMock.mockClear()

    await act(async () => {
      await result.current.refresh()
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(true)
  })

  it('does not fetch management documents while another documents tab is active', async () => {
    pathnameMock = '/main-page/request/documents/operationaldocuments'

    renderHook(() => useManagementDocuments())

    await waitFor(() => {
      expect(fetchMock).not.toHaveBeenCalled()
    })
  })

  it('redirects and skips fetching when user is not gerence', async () => {
    authUserMock = { isGerence: false }

    renderHook(() => useManagementDocuments())

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith(
        '/main-page/request/documents/operationaldocuments',
      )
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
