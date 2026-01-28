'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { BillingDocumentDetailsTableListMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocumentDetailsTable, BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import type { BillingImages } from '@/app/mappings/billingimages/billingimages.types'
import { useBillingDocumentsStore } from '@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore'
import { useBillingImagesStore } from '@/app/stores/useBillingImagesStore/useBillingImagesStore'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'


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
  const { billingImages, fetchBillingImages } = useBillingImagesStore(
    (s) => ({
      billingImages: s.billingImages,
      fetchBillingImages: s.fetchBillingImages,
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
        description: String(error) || "Hubo un problema desconocido",
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      });
    }
    if (downloaderror) {
      showAlert({
        type: "error",
        title: "Error",
        description: String(downloaderror) || "Hubo un problema desconocido",
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

  }, [loading, error, succesDownloadDocument, downloadingDocument, downloaderror, showAlert])

  useEffect(() => {
    if (!requisitionId) return
    fetchBillingDocumentByIdRequisition(requisitionId, true)
  }, [requisitionId, fetchBillingDocumentByIdRequisition])

  useEffect(() => {
    fetchBillingImages()
  }, [fetchBillingImages])

  const normalizeImages = (images: BillingImages["images"]): string[] => {
    if (Array.isArray(images)) return images.filter((item) => Boolean(item))
    return []
  }

  const mapTicketsToRows = (
    images: BillingImages[],
    requisitionIdValue?: string
  ): BillingDocumentDetailsTable[] =>
    images
      .filter((item) =>
        requisitionIdValue
          ? item?.requisition?.billingrequisition_id === requisitionIdValue
          : true
      )
      .map((item) => {
        const imageUrls = normalizeImages(item.images)
        return {
          id: `ticket-${item.billing_image_id}`,
          billingdocument_id: `ticket-${item.billing_image_id}`,
          fecha: item.dateCreate,
          rfc_emisor: "",
          description: item.description?.name ?? item.category?.name ?? "Ticket",
          numpersons: item.numpersons ?? null,
          numnights: item.numnights ?? null,
          uuid: item.requisition?.requisitionkey ?? item.billing_image_id,
          subtotal: 0,
          iva: 0,
          total: 0,
          otherinvoices: 0,
          status: item.status ?? "",
          xmlUrl: undefined,
          pdfUrl: undefined,
          imageUrl: imageUrls[0],
        }
      })

  const rows: BillingDocumentDetailsTable[] = useMemo(() => {
    const documentsRows = BillingDocumentDetailsTableListMap(billingDocuments ?? [])
    const ticketRows = mapTicketsToRows(billingImages ?? [], requisitionId)
    return [...ticketRows, ...documentsRows]
  }, [billingDocuments, billingImages, requisitionId])

  const mapImageToDocument = (image: BillingImages): BillingDocuments => ({
    id: `ticket-${image.billing_image_id}`,
    billingdocument_id: `ticket-${image.billing_image_id}`,
    requisition: image.requisition,
    billingimages_id: image.billing_image_id,
    xml: "",
    pdf: "",
    image: normalizeImages(image.images)[0] ?? "",
    status: image.status ?? "",
    comments: image.comments ?? "",
    rfc_emisor: "",
    rfc_receptor: "",
    conceptos: [],
    uuid: image.requisition?.requisitionkey ?? image.billing_image_id,
    fecha: image.dateCreate,
    xmlinformation: "",
    date_created: image.dateCreate,
    user_comments: image.comments ?? "",
    forbidden_code: false,
    sat_validation: false,
    billingAcuse: null,
    description: image.description,
    numpersons: image.numpersons ?? 0,
    numnights: image.numnights ?? 0,
    total: 0,
    subtotal: 0,
    iva: 0,
    otherinvoices: 0,
    category: image.category,
    validatedbyoperations: false,
  })

  const handleOpenDetails = (row: BillingDocumentDetailsTable) => {
    const billingdocument = billingDocuments.find(document => document.billingdocument_id == row.billingdocument_id);
    if (billingdocument) {
      setSelected(billingdocument);
      setPanelOpen(true);
      return
    }
    const ticketId = row.billingdocument_id?.replace("ticket-", "");
    const ticket = billingImages.find(
      (image) => image.billing_image_id === ticketId
    );
    if (ticket) {
      setSelected(mapImageToDocument(ticket));
      setPanelOpen(true);
    }
  }

  return { rows, panelOpen, selected, loading, requisitionId,downloadingDocument, handleOpenDetails, setPanelOpen,downloadRequistionResume }
}

export default useRequisitionDetailsDocument
