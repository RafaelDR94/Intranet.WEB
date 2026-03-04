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
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { useTutorials } from "@/tutorials/engine/TutorialProvider";


/**
 * Hook para cargar y exponer los documentos de facturas asociados a una requisición.
 * Toma el `id` de la requisición desde los query params y realiza el fetch en el store.
 */
const useRequisitionDetailsDocument = (overrideRequisitionId?: string) => {
  const { usePrincipalAlert } = usePrincipal();
  const { showAlert } = usePrincipalAlert
  const searchParams = useSearchParams()
  const requisitionId = overrideRequisitionId ?? searchParams.get('id') ?? undefined
  const [panelOpen, setPanelOpen] = useState(false)
  const [selected, setSelected] = useState<BillingDocuments | null>(null)
  const [documentImages, setDocumentImages] = useState<Record<string, string>>({})
  const { activeTutorialId } = useTutorials();
  const isTutorialActive = activeTutorialId === "operations-requisitions:detail";
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
  const { billingImages, fetchBillingImages, fetchBillingImageById } = useBillingImagesStore(
    (s) => ({
      billingImages: s.billingImages,
      fetchBillingImages: s.fetchBillingImages,
      fetchBillingImageById: s.fetchBillingImageById,
    }),
    shallow
  )
  const { user } = useAuth()

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
    if (isTutorialActive) return
    if (!requisitionId) return
    fetchBillingDocumentByIdRequisition(requisitionId, true)
  }, [requisitionId, fetchBillingDocumentByIdRequisition, isTutorialActive])

  useEffect(() => {
    if (isTutorialActive) return
    if (!selected) return
    const updated = billingDocuments.find(
      (doc) => doc.billingdocument_id === selected.billingdocument_id
    )
    if (updated && updated.status !== selected.status) {
      setSelected(updated)
    }
  }, [billingDocuments, selected])

  useEffect(() => {
    if (!selected) return
    const isTicket =
      selected.billingdocument_id?.startsWith("ticket-") || selected.billingimages_id
    if (!isTicket || selected.user_comments) return
    const imageId =
      selected.billingimages_id || selected.billingdocument_id?.replace("ticket-", "")
    if (!imageId) return

    const loadComment = async () => {
      const image = await fetchBillingImageById(imageId, true)
      if (!image) return
      const nextComment = image.user_comments ?? image.comments ?? ""
      if (!nextComment) return
      setSelected((prev) =>
        prev ? { ...prev, user_comments: nextComment, comments: prev.comments || nextComment } : prev
      )
    }

    loadComment()
  }, [fetchBillingImageById, selected, isTutorialActive])

  useEffect(() => {
    if (isTutorialActive) return
    if (!selected?.billingimages_id || selected.image) return
    let active = true

    const loadImage = async () => {
      const image = await fetchBillingImageById(selected.billingimages_id, true)
      if (!image || !active) return
      const imageUrl = normalizeImages(image.images)[0]
      if (!imageUrl) return
      setSelected((prev) => (prev ? { ...prev, image: imageUrl } : prev))
    }

    void loadImage()

    return () => {
      active = false
    }
  }, [fetchBillingImageById, selected, isTutorialActive])

  useEffect(() => {
    if (isTutorialActive) return
    if (!user?.idEmployee) return
    fetchBillingImages(user.idEmployee)
  }, [fetchBillingImages, user?.idEmployee, isTutorialActive])

  useEffect(() => {
    if (isTutorialActive) return
    if (!billingDocuments?.length) return
    const pendingIds = billingDocuments
      .map((doc) => doc.billingimages_id)
      .filter((id): id is string => Boolean(id))
      .filter((id) => !documentImages[id])

    if (pendingIds.length === 0) return

    let active = true

    const loadImages = async () => {
      const results = await Promise.all(
        pendingIds.map((id) => fetchBillingImageById(id, true))
      )

      if (!active) return

      const next: Record<string, string> = {}
      results.forEach((image, index) => {
        if (!image) return
        const url = normalizeImages(image.images)[0]
        if (url) {
          next[pendingIds[index]] = url
        }
      })

      if (Object.keys(next).length > 0) {
        setDocumentImages((prev) => ({ ...prev, ...next }))
      }
    }

    void loadImages()

    return () => {
      active = false
    }
  }, [billingDocuments, documentImages, fetchBillingImageById, isTutorialActive])

  const normalizeImages = (images: BillingImages["images"]): string[] => {
    if (!Array.isArray(images)) return []
    return images
      .map((item) => (typeof item === 'string' ? item : item?.image ?? ''))
      .filter((item) => Boolean(item))
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
          billingimages_id: item.billing_image_id,
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
          comments: item.comments ?? "",
          user_comments: item.user_comments ?? item.comments ?? "",
          authorization: null,
        }
      })

  const mockImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P4z8DwHwAFgwJ/lm8X3wAAAABJRU5ErkJggg==";
  const mockRow: BillingDocumentDetailsTable = useMemo(
    () => ({
      id: "mock-detail-doc-001",
      billingdocument_id: "mock-detail-doc-001",
      billingimages_id: "mock-detail-image-001",
      fecha: "2026-02-26",
      rfc_emisor: "RFC123456",
      rfc_receptor: "RFC654321",
      description: "Hospedaje",
      numpersons: 2,
      numnights: 3,
      uuid: "UUID-MOCK-001",
      subtotal: 1200,
      iva: 192,
      total: 1392,
      otherinvoices: 0,
      status: "Pendiente",
      xmlUrl: "data:text/xml;base64,PHhtbD5Nb2NrPC94bWw+",
      pdfUrl: "data:application/pdf;base64,JVBERi0xLjQKJcfs",
      imageUrl: mockImage,
      comments: "Documento de ejemplo",
      user_comments: "Documento de ejemplo",
      authorization: { idAuthorization: "mock-auth" } as any,
    }),
    [mockImage],
  );

  const mockSelected: BillingDocuments = useMemo(
    () => ({
      id: "mock-detail-doc-001",
      billingdocument_id: "mock-detail-doc-001",
      requisition: { requisitionkey: "REQ-MOCK-001" } as any,
      billingimages_id: "mock-detail-image-001",
      xml: "data:text/xml;base64,PHhtbD5Nb2NrPC94bWw+",
      pdf: "data:application/pdf;base64,JVBERi0xLjQKJcfs",
      image: mockImage,
      status: "Pendiente",
      comments: "Documento de ejemplo",
      rfc_emisor: "RFC123456",
      rfc_receptor: "RFC654321",
      conceptos: [],
      uuid: "UUID-MOCK-001",
      fecha: "2026-02-26",
      xmlinformation: "",
      date_created: "2026-02-26",
      user_comments: "Documento de ejemplo",
      forbidden_code: false,
      sat_validation: false,
      billingAcuse: null,
      description: { name: "Hospedaje" } as any,
      numpersons: 2,
      numnights: 3,
      total: 1392,
      subtotal: 1200,
      iva: 192,
      otherinvoices: 0,
      category: { name: "Hospedaje" } as any,
      validatedbyoperations: false,
      authorization: null,
    }),
    [mockImage],
  );

  const rows: BillingDocumentDetailsTable[] = useMemo(() => {
    if (isTutorialActive) return [mockRow];
    const documentsRows = BillingDocumentDetailsTableListMap(billingDocuments ?? [])
    const ticketRows = mapTicketsToRows(billingImages ?? [], requisitionId)
    const imagesByTicketId = new Map<string, string>()
    ;(billingImages ?? []).forEach((image) => {
      const imageUrl = normalizeImages(image.images)[0] ?? ""
      if (!imageUrl) return
      imagesByTicketId.set(`ticket-${image.billing_image_id}`, imageUrl)
      imagesByTicketId.set(image.billing_image_id, imageUrl)
      if (image.requisition?.requisitionkey) {
        imagesByTicketId.set(image.requisition.requisitionkey, imageUrl)
      }
    })

    const enrichedDocumentRows = documentsRows.map((row) => {
      if (row.imageUrl) return row
      if (row.billingimages_id && documentImages[row.billingimages_id]) {
        return { ...row, imageUrl: documentImages[row.billingimages_id] }
      }
      const ticketImage =
        imagesByTicketId.get(row.billingdocument_id) ??
        imagesByTicketId.get(row.uuid)
      return ticketImage ? { ...row, imageUrl: ticketImage } : row
    })

    return [...ticketRows, ...enrichedDocumentRows]
  }, [billingDocuments, billingImages, documentImages, requisitionId, isTutorialActive, mockRow])

  const handleOpenImage = async (row: BillingDocumentDetailsTable) => {
    if (row.imageUrl) {
      window.open(row.imageUrl, "_blank")
      return
    }

    const ticketId = row.billingdocument_id?.startsWith("ticket-")
      ? row.billingdocument_id.replace("ticket-", "")
      : undefined
    const imageId = row.billingimages_id ?? ticketId
    if (!imageId) return

    const image = await fetchBillingImageById(imageId, true)
    const imageUrl = image ? normalizeImages(image.images)[0] : undefined
    if (imageUrl) {
      window.open(imageUrl, "_blank")
      return
    }

    showAlert({
      type: "warning",
      title: "Imagen no disponible",
      description: "No se encontrÃ³ una imagen para este registro.",
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1500,
    })
  }

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
    user_comments: image.user_comments ?? image.comments ?? "",
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
    authorization: null,
  })

  const handleOpenDetails = (row: BillingDocumentDetailsTable) => {
    if (isTutorialActive) {
      setSelected(mockSelected);
      setPanelOpen(true);
      return;
    }
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

  return {
    rows,
    panelOpen,
    selected,
    loading,
    requisitionId,
    downloadingDocument,
    handleOpenDetails,
    handleOpenImage,
    setPanelOpen,
    downloadRequistionResume,
  }
}

export default useRequisitionDetailsDocument
