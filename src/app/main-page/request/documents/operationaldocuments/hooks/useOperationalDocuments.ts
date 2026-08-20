'use client'

import { useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'

import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { mapOperationalDocumentsToTableRows } from '@/app/mappings/documents/documents.mapper'
import type { ManagementDocumentTableRow } from '@/app/mappings/documents/documents.types'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'

export const useOperationalDocuments = () => {
  const {
    operationalDocuments,
    loading,
    error,
    successGet,
    fetchDocumentsByUser,
    fetchDocuments,
    deleteDocument,
    deletingDocument,
    successDeleteDocument,
  } = useDocumentsStore((state) => ({
    operationalDocuments: state.operationalDocuments,
    loading: state.loading,
    error: state.error,
    successGet: state.successGet,
    fetchDocumentsByUser: state.fetchDocumentsByUser,
    fetchDocuments: state.fetchDocuments,
    deleteDocument: state.deleteDocument,
    deletingDocument: state.deletingDocument,
    successDeleteDocument: state.successDeleteDocument,
  }))

  const { user, getRoutePermissions } = useAuth()
  const pathname = usePathname()
  const isOperationalDocumentsRoute = pathname?.includes('/documents/operationaldocuments')
  const documentsRoutePermissions = getRoutePermissions?.('/main-page/request/documents')
  const canGetAllDocuments = documentsRoutePermissions?.getAlldocuments === true

  useEffect(() => {
    if (!isOperationalDocumentsRoute) return

    if (canGetAllDocuments) {
      void fetchDocuments(true)
      return
    }

    if (user?.idUser) {
      void fetchDocumentsByUser(user.idUser, true)
    }
  }, [
    canGetAllDocuments,
    fetchDocuments,
    fetchDocumentsByUser,
    isOperationalDocumentsRoute,
    user?.idUser,
  ])

  const rows: ManagementDocumentTableRow[] = useMemo(
    () => mapOperationalDocumentsToTableRows(operationalDocuments),
    [operationalDocuments],
  )

  return {
    rows,
    loading,
    error,
    successGet,
    deletingDocument,
    successDeleteDocument,
    deleteDocument,
    refresh: () =>
      canGetAllDocuments
        ? fetchDocuments(true)
        : user?.idUser
          ? fetchDocumentsByUser(user.idUser, true)
          : Promise.resolve(),
  }
}

export type UseOperationalDocumentsReturn = ReturnType<typeof useOperationalDocuments>
