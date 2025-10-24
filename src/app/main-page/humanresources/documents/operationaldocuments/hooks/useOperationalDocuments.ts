'use client'

import { useEffect, useMemo } from 'react'

import { mapOperationalDocumentsToTableRows } from '@/app/mappings/documents/documents.mapper'
import type { ManagementDocumentTableRow } from '@/app/mappings/documents/documents.types'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'

export const useOperationalDocuments = () => {
  const { documents, loading, error, successGet, fetchDocuments } = useDocumentsStore((state) => ({
    documents: state.documents,
    loading: state.loading,
    error: state.error,
    successGet: state.successGet,
    fetchDocuments: state.fetchDocuments,
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
    refresh: () => fetchDocuments(true),
  }
}

export type UseOperationalDocumentsReturn = ReturnType<typeof useOperationalDocuments>
