import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import type { ManagementDocument } from '@/app/mappings/documents/documents.types'

const fetchMock = vi.fn<Promise<void>, [boolean?]>(() => Promise.resolve())
const deleteMock = vi.fn()

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

import { useManagementDocuments } from './useManagementDocuments'

describe('useManagementDocuments hook', () => {
  beforeEach(() => {
    fetchMock.mockClear()
    deleteMock.mockClear()
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
      expect(fetchMock).toHaveBeenLastCalledWith()
    })

    fetchMock.mockClear()

    await act(async () => {
      await result.current.refresh()
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock).toHaveBeenCalledWith(true)
  })
})
