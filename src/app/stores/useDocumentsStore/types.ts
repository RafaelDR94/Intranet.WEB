import type { ManagementDocument } from '@/app/mappings/documents/documents.types'

export type DocumentsState = {
  documents: ManagementDocument[]
  managementDocuments: ManagementDocument[]
  loading: boolean
  successGet: boolean
  error?: string
  fetchDocuments: (force?: boolean) => Promise<void>
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial: Partial<DocumentsState> | ((state: DocumentsState) => Partial<DocumentsState>),
) => void

export type Get = () => DocumentsState
