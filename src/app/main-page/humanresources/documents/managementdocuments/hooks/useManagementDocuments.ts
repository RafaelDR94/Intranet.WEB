'use client'

import { useEffect, useMemo } from 'react'

import { mapManagementDocumentsToTableRows } from '@/app/mappings/documents/documents.mapper'
import type { ManagementDocumentTableRow } from '@/app/mappings/documents/documents.types'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'

export const useManagementDocuments = () => {
  const {
    managementDocuments,
    loading,
    error,
    successGet,
    fetchDocuments,
    deleteDocument,
    deletingDocument,
    successDeleteDocument,
  } = useDocumentsStore(
    (state) => ({
      managementDocuments: state.managementDocuments,
      loading: state.loading,
      error: state.error,
      successGet: state.successGet,
      fetchDocuments: state.fetchDocuments,
      deleteDocument: state.deleteDocument,
      deletingDocument: state.deletingDocument,
      successDeleteDocument: state.successDeleteDocument,
    }),
  )

  useEffect(() => {
    void fetchDocuments()
  }, [fetchDocuments])

  const rows: ManagementDocumentTableRow[] = useMemo(
    () => mapManagementDocumentsToTableRows(managementDocuments),
    [managementDocuments],
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

export type UseManagementDocumentsReturn = ReturnType<typeof useManagementDocuments>
