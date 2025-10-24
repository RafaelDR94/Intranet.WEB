import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import type { ManagementDocument } from '@/app/mappings/documents/documents.types'

const fetchMock = vi.fn()

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
      reset: vi.fn(),
      resetFlags: vi.fn(),
    }),
}))

import { useManagementDocuments } from './useManagementDocuments'

describe('useManagementDocuments hook', () => {
  beforeEach(() => {
    fetchMock.mockClear()
  })

  it('maps store documents into table rows and triggers fetch', async () => {
    const { result } = renderHook(() => useManagementDocuments())

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0].name).toBe('Manual de procesos')
    expect(result.current.rows[0].documentType).toBe('FORMATO')
  })
})
