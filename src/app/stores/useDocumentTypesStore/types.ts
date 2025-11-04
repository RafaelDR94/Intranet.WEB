import type { DocumentTypeSummary } from '@/app/mappings/documents/documents.types'

export type DocumentTypesState = {
  documentTypes: DocumentTypeSummary[]
  activeDocumentTypes: DocumentTypeSummary[]
  loading: boolean
  successGet: boolean
  error?: string
  fetchDocumentTypes: (force?: boolean) => Promise<void>
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial:
    | Partial<DocumentTypesState>
    | ((state: DocumentTypesState) => Partial<DocumentTypesState>),
) => void

export type Get = () => DocumentTypesState
