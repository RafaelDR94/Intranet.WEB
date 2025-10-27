import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { DocumentTypesState, Set } from './types'

const fetchDocumentTypesMock = vi.fn(async (set: Set) => {
  set({
    documentTypes: [
      {
        document_type_id: '1dcf1875-35b6-4d9c-b6a2-6df144f1580c',
        name: 'FORMATO',
        description: 'FORMATO',
        is_active: false,
      },
    ],
    activeDocumentTypes: [],
    loading: false,
    successGet: true,
  })
})

vi.mock('./utilities', () => ({
  fetchDocumentTypes: (...args: any[]) => fetchDocumentTypesMock(...args),
}))

import { useDocumentTypesStore } from './useDocumentTypesStore'

describe('useDocumentTypesStore', () => {
  beforeEach(() => {
    fetchDocumentTypesMock.mockClear()
    useDocumentTypesStore.setState({
      documentTypes: [],
      activeDocumentTypes: [],
      loading: false,
      successGet: false,
      error: undefined,
      fetchDocumentTypes: useDocumentTypesStore.getState().fetchDocumentTypes,
      reset: useDocumentTypesStore.getState().reset,
      resetFlags: useDocumentTypesStore.getState().resetFlags,
    } as DocumentTypesState)
  })

  it('starts with empty collections', () => {
    const state = useDocumentTypesStore.getState()
    expect(state.documentTypes).toEqual([])
    expect(state.activeDocumentTypes).toEqual([])
  })

  it('fetchDocumentTypes loads data', async () => {
    await useDocumentTypesStore.getState().fetchDocumentTypes()
    const state = useDocumentTypesStore.getState()
    expect(fetchDocumentTypesMock).toHaveBeenCalled()
    expect(state.documentTypes).toHaveLength(1)
    expect(state.successGet).toBe(true)
  })

  it('reset clears collections', () => {
    useDocumentTypesStore.setState({
      documentTypes: [
        {
          document_type_id: 'type-1',
          name: 'FORMATO',
          description: 'FORMATO',
          is_active: true,
        },
      ] as any,
      activeDocumentTypes: [
        {
          document_type_id: 'type-1',
          name: 'FORMATO',
          description: 'FORMATO',
          is_active: true,
        },
      ] as any,
      loading: false,
      successGet: true,
      error: undefined,
      fetchDocumentTypes: useDocumentTypesStore.getState().fetchDocumentTypes,
      reset: useDocumentTypesStore.getState().reset,
      resetFlags: useDocumentTypesStore.getState().resetFlags,
    } as DocumentTypesState)

    useDocumentTypesStore.getState().reset()
    const state = useDocumentTypesStore.getState()
    expect(state.documentTypes).toEqual([])
    expect(state.activeDocumentTypes).toEqual([])
    expect(state.successGet).toBe(false)
  })
})
