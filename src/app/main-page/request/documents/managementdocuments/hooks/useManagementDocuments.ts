'use client'

import { useEffect, useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { mapManagementDocumentsToTableRows } from '@/app/mappings/documents/documents.mapper'
import type { ManagementDocumentTableRow } from '@/app/mappings/documents/documents.types'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { useDocumentsStore } from '@/app/stores/useDocumentsStore/useDocumentsStore'

export const useManagementDocuments = () => {
  const { user } = useAuth()
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
  const pathname = usePathname()
  const router = useRouter()
  const isManagementDocumentsRoute = pathname?.includes('/documents/managementdocuments')
  const canViewManagementDocuments =
    user?.isGerence === true || user?.rolName?.trim().toLowerCase() === 'admin'

  useEffect(() => {
    if (!isManagementDocumentsRoute || canViewManagementDocuments) return

    router.replace('/main-page/request/documents/operationaldocuments')
  }, [canViewManagementDocuments, isManagementDocumentsRoute, router])

  useEffect(() => {
    if (!isManagementDocumentsRoute || !canViewManagementDocuments) return

    void fetchDocuments(true)
  }, [canViewManagementDocuments, fetchDocuments, isManagementDocumentsRoute])

  const rows: ManagementDocumentTableRow[] = useMemo(
    () =>
      canViewManagementDocuments
        ? mapManagementDocumentsToTableRows(managementDocuments)
        : [],
    [canViewManagementDocuments, managementDocuments],
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
      canViewManagementDocuments ? fetchDocuments(true) : Promise.resolve(),
  }
}

export type UseManagementDocumentsReturn = ReturnType<typeof useManagementDocuments>
