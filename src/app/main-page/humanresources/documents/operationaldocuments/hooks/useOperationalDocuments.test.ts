import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { ManagementDocument } from '@/app/mappings/documents/documents.types'

const fetchMock = vi.fn()

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
      loading: false,
      successGet: true,
      error: undefined,
      fetchDocuments: fetchMock,
      reset: vi.fn(),
      resetFlags: vi.fn(),
    }),
}))

import { useOperationalDocuments } from './useOperationalDocuments'

describe('useOperationalDocuments hook', () => {
  beforeEach(() => {
    fetchMock.mockClear()
  })

  it('maps non management documents into table rows and triggers fetch', async () => {
    const { result } = renderHook(() => useOperationalDocuments())

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalled()
    })

    expect(result.current.rows).toHaveLength(1)
    expect(result.current.rows[0].name).toBe('Código de proyectos DR')
    expect(result.current.rows[0].documentType).toBe('FORMATO')
  })
})
