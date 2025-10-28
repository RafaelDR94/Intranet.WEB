'use client'

import { useEffect, useMemo } from 'react'

import { mapOperationalDocumentsToTableRows } from '@/app/mappings/documents/documents.mapper'
import type { ManagementDocumentTableRow } from '@/app/mappings/documents/documents.types'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'

export const useOperationalDocuments = () => {
  const {
    documents,
    loading,
    error,
    successGet,
    fetchDocuments,
    deleteDocument,
    deletingDocument,
    successDeleteDocument,
  } = useDocumentsStore((state) => ({
    documents: state.documents,
    loading: state.loading,
    error: state.error,
    successGet: state.successGet,
    fetchDocuments: state.fetchDocuments,
    deleteDocument: state.deleteDocument,
    deletingDocument: state.deletingDocument,
    successDeleteDocument: state.successDeleteDocument,
  }))

  useEffect(() => {
    void fetchDocuments()
  }, [fetchDocuments])

  const rows: ManagementDocumentTableRow[] = useMemo(
    () => mapOperationalDocumentsToTableRows(documents),
    [documents],
  )

  return {
    rows,
    loading,
    error,
    successGet,
    deletingDocument,
    successDeleteDocument,
    deleteDocument,
    refresh: () => fetchDocuments(true),
  }
}

export type UseOperationalDocumentsReturn = ReturnType<typeof useOperationalDocuments>
