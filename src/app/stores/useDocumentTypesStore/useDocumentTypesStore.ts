'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { DocumentTypesState } from './types'
import { fetchDocumentTypes } from './utilities'

const initialState: Pick<
  DocumentTypesState,
  'documentTypes' | 'activeDocumentTypes' | 'loading' | 'successGet' | 'error'
> = {
  documentTypes: [],
  activeDocumentTypes: [],
  loading: false,
  successGet: false,
  error: undefined,
}

export const useDocumentTypesStore = createWithEqualityFn<DocumentTypesState>()(
  devtools((set, get) => ({
    ...initialState,

    fetchDocumentTypes: (force = false) => fetchDocumentTypes(set, get, force),

    reset: () => set({ ...initialState }),

    resetFlags: () => set({ loading: false, successGet: false, error: undefined }),
  })),
)
