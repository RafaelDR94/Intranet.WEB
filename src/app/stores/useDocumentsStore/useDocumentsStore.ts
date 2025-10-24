'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { DocumentsState } from './types'
import { fetchDocuments } from './utilities'

const initialState: Pick<DocumentsState, 'documents' | 'managementDocuments' | 'loading' | 'successGet' | 'error'> = {
  documents: [],
  managementDocuments: [],
  loading: false,
  successGet: false,
  error: undefined,
}

export const useDocumentsStore = createWithEqualityFn<DocumentsState>()(
  devtools((set, get) => ({
    ...initialState,

    fetchDocuments: (force = false) => fetchDocuments(set, get, force),

    reset: () => set({ ...initialState }),

    resetFlags: () => set({ loading: false, successGet: false, error: undefined }),
  })),
)
