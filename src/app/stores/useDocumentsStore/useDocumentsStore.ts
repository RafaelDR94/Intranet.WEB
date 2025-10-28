'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { DocumentsState } from './types'
import { deleteDocument, fetchDocuments } from './utilities'

const initialState: Pick<
  DocumentsState,
  |
    'documents'
    | 'managementDocuments'
    | 'loading'
    | 'successGet'
    | 'deletingDocument'
    | 'successDeleteDocument'
    | 'error'
> = {
  documents: [],
  managementDocuments: [],
  loading: false,
  successGet: false,
  deletingDocument: false,
  successDeleteDocument: false,
  error: undefined,
}

export const useDocumentsStore = createWithEqualityFn<DocumentsState>()(
  devtools((set, get) => ({
    ...initialState,

    fetchDocuments: (force = false) => fetchDocuments(set, get, force),
    deleteDocument: (id: string) => deleteDocument(set, get, id),

    reset: () => set({ ...initialState }),

    resetFlags: () =>
      set({
        loading: false,
        successGet: false,
        deletingDocument: false,
        successDeleteDocument: false,
        error: undefined,
      }),
  })),
)
