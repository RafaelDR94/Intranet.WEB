import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { DocumentsState, Set } from './types'

const fetchDocumentsMock = vi.fn(async (set: Set) => {
  set({
    documents: [
      {
        document_id: '1',
        name: 'Doc',
        code: 'A1',
        description: 'Desc',
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
        route: 'https://example.com',
        extension: 'pdf',
        created_at: '2025-10-24',
      },
    ],
    managementDocuments: [
      {
        document_id: '1',
        name: 'Doc',
        code: 'A1',
        description: 'Desc',
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
        route: 'https://example.com',
        extension: 'pdf',
        created_at: '2025-10-24',
      },
    ],
    loading: false,
    successGet: true,
  })
})
const fetchDocumentsByUserMock = vi.fn(async (set: Set) => {
  await fetchDocumentsMock(set)
})

const deleteDocumentMock = vi.fn()

vi.mock('./utilities', () => ({
  fetchDocuments: (...args: any[]) => fetchDocumentsMock(...args),
  fetchDocumentsByUser: (...args: any[]) => fetchDocumentsByUserMock(...args),
  deleteDocument: (...args: any[]) => deleteDocumentMock(...args),
}))

import { useDocumentsStore } from './useDocumentsStore'

describe('useDocumentsStore', () => {
  beforeEach(() => {
    fetchDocumentsMock.mockClear()
    fetchDocumentsByUserMock.mockClear()
    useDocumentsStore.setState({
      documents: [],
      managementDocuments: [],
      loading: false,
      successGet: false,
      deletingDocument: false,
      successDeleteDocument: false,
      error: undefined,
      fetchDocuments: useDocumentsStore.getState().fetchDocuments,
      fetchDocumentsByUser: useDocumentsStore.getState().fetchDocumentsByUser,
      deleteDocument: useDocumentsStore.getState().deleteDocument,
      reset: useDocumentsStore.getState().reset,
      resetFlags: useDocumentsStore.getState().resetFlags,
    } as DocumentsState)
  })

  it('starts with empty collections', () => {
    const state = useDocumentsStore.getState()
    expect(state.documents).toEqual([])
    expect(state.managementDocuments).toEqual([])
  })

  it('fetchDocuments loads data', async () => {
    await useDocumentsStore.getState().fetchDocuments()
    const state = useDocumentsStore.getState()
    expect(fetchDocumentsMock).toHaveBeenCalled()
    expect(state.documents).toHaveLength(1)
    expect(state.managementDocuments).toHaveLength(1)
    expect(state.successGet).toBe(true)
  })

  it('fetchDocumentsByUser loads data', async () => {
    await useDocumentsStore.getState().fetchDocumentsByUser('user-1')
    const state = useDocumentsStore.getState()
    expect(fetchDocumentsByUserMock).toHaveBeenCalled()
    expect(state.documents).toHaveLength(1)
    expect(state.managementDocuments).toHaveLength(1)
    expect(state.successGet).toBe(true)
  })

  it('reset clears collections', () => {
    useDocumentsStore.setState({
      documents: [{
        document_id: '1',
        name: 'Doc',
        code: 'A1',
        description: 'Desc',
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
        route: 'https://example.com',
        extension: 'pdf',
      } as any],
      managementDocuments: [] as any,
      loading: false,
      successGet: true,
      deletingDocument: true,
      successDeleteDocument: true,
      error: undefined,
      fetchDocuments: useDocumentsStore.getState().fetchDocuments,
      fetchDocumentsByUser: useDocumentsStore.getState().fetchDocumentsByUser,
      deleteDocument: useDocumentsStore.getState().deleteDocument,
      reset: useDocumentsStore.getState().reset,
      resetFlags: useDocumentsStore.getState().resetFlags,
    } as DocumentsState)

    useDocumentsStore.getState().reset()
    const state = useDocumentsStore.getState()
    expect(state.documents).toEqual([])
    expect(state.managementDocuments).toEqual([])
    expect(state.successGet).toBe(false)
    expect(state.deletingDocument).toBe(false)
    expect(state.successDeleteDocument).toBe(false)
  })
})
