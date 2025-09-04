'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useBillingDocumentsStore } from '@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'
import { shallow } from 'zustand/shallow'
import type { BillingDocumentDetailsTable, BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { BillingDocumentDetailsTableListMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
/**
 * Hook para cargar y exponer los documentos de facturas asociados a una requisición.
 * Toma el `id` de la requisición desde los query params y realiza el fetch en el store.
 */
const useRequisitionDetailsDocument = () => {
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert } = usePrincipalAlert
  const searchParams = useSearchParams()
  const requisitionId = searchParams.get('id') ?? undefined
  const [panelOpen, setPanelOpen] = useState(false)
  const [selected, setSelected] = useState<BillingDocuments | null>(null)
  const {
    fetchBillingDocumentByIdRequisition,
    billingDocuments,
    loading,
    error,
  } = useBillingDocumentsStore(
    (s) => ({
      fetchBillingDocumentByIdRequisition: s.fetchBillingDocumentByIdRequisition,
      billingDocuments: s.billingDocuments,
      loading: s.loading,
      error: s.error,
      succesValidate: s.succesValidate,
      succesReject:s.succesReject
    }),
    shallow
  )

  const {
    downloadingDocument,
    succesDownloadDocument,
    downloadRequistionResume,
    downloaderror,
  } = useRequisitionsStore(
    (s) => ({
      downloadingDocument: s.downloadingDocument,
      downloadRequistionResume: s.downloadRequistionResume,
      downloaderror: s.error,
      succesDownloadDocument: s.succesDownloadDocument
    }),
    shallow
  )

  useEffect(() => {

    if (loading || downloadingDocument) {
      return;
    }

    if (error) {
      showAlert({
        type: "error",
        title: "Error",
        description: String(error) ?? "Hubo un problema desconocido",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    if (downloaderror) {
      showAlert({
        type: "error",
        title: "Error",
        description: String(downloaderror) ?? "Hubo un problema desconocido",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    if (succesDownloadDocument) {
      showAlert({
        type: "info",
        title: "Descarga completa",
        description: "Se descargo correctamente el documento.",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }

  }, [loading, error, succesDownloadDocument, downloadingDocument])

  useEffect(() => {
    if (!requisitionId) return
    fetchBillingDocumentByIdRequisition(requisitionId, true)
  }, [requisitionId, fetchBillingDocumentByIdRequisition])

  const rows: BillingDocumentDetailsTable[] = useMemo(() => {
    return BillingDocumentDetailsTableListMap(billingDocuments ?? [])
  }, [billingDocuments])

  const handleOpenDetails = (row: BillingDocumentDetailsTable) => {
    const billingdocument = billingDocuments.find(document => document.billingdocument_id == row.billingdocument_id);
    if (billingdocument) {
      setSelected(billingdocument);
      setPanelOpen(true);
    }

  }

  return { rows, panelOpen, selected, loading, requisitionId,downloadingDocument, handleOpenDetails, setPanelOpen,downloadRequistionResume }
}

export default useRequisitionDetailsDocument
