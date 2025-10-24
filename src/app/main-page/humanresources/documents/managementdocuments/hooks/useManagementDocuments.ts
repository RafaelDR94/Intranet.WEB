'use client'

import { useEffect, useMemo } from 'react'

import { mapManagementDocumentsToTableRows } from '@/app/mappings/documents/documents.mapper'
import type { ManagementDocumentTableRow } from '@/app/mappings/documents/documents.types'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'

export const useManagementDocuments = () => {
  const { managementDocuments, loading, error, successGet, fetchDocuments } = useDocumentsStore(
    (state) => ({
      managementDocuments: state.managementDocuments,
      loading: state.loading,
      error: state.error,
      successGet: state.successGet,
      fetchDocuments: state.fetchDocuments,
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
    refresh: () => fetchDocuments(true),
  }
}

export type UseManagementDocumentsReturn = ReturnType<typeof useManagementDocuments>
