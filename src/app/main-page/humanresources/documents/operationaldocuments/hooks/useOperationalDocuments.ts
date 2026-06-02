'use client'

import { useEffect, useMemo } from 'react'

import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { mapOperationalDocumentsToTableRows } from '@/app/mappings/documents/documents.mapper'
import type { ManagementDocumentTableRow } from '@/app/mappings/documents/documents.types'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'

export const useOperationalDocuments = () => {
  const {
    documents,
    loading,
    error,
    successGet,
    fetchDocumentsByUser,
    fetchDocuments,
    deleteDocument,
    deletingDocument,
    successDeleteDocument,
  } = useDocumentsStore((state) => ({
    documents: state.documents,
    loading: state.loading,
    error: state.error,
    successGet: state.successGet,
    fetchDocumentsByUser: state.fetchDocumentsByUser,
    fetchDocuments: state.fetchDocuments,
    deleteDocument: state.deleteDocument,
    deletingDocument: state.deletingDocument,
    successDeleteDocument: state.successDeleteDocument,
  }))

  const { user } = useAuth()

  useEffect(() => {
    if (user?.idUser) {
      void fetchDocumentsByUser(user.idUser)
      return
    }

    void fetchDocuments()
  }, [fetchDocuments, fetchDocumentsByUser, user?.idUser])

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
    refresh: () => (user?.idUser ? fetchDocumentsByUser(user.idUser, true) : fetchDocuments(true)),
  }
}

export type UseOperationalDocumentsReturn = ReturnType<typeof useOperationalDocuments>
