"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { shallow } from 'zustand/shallow'

import { DataTable } from '@/app/components/DataTable/DataTable'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import { Button } from '@/app/components/Button/Button'
import Label from '@/app/components/Label/Label'
import LoadingOverlay from '@/app/components/LoadingOverLay/LoadingOverlay'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import DetailsPanel from '../DetailsPanel/DetailsPanel'

import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import type { BillingAllDocumentsByRequisition } from '@/app/mappings/billingalldocuments/billingalldocuments.types'
import { useBillingAllDocumentsByRequisitionStore } from '@/app/stores/useBillingAllDocumentsByRequisitionStore/useBillingAllDocumentsByRequisitionStore'

import XMLIcon from '@/assets/icons/Docs/privacy policy.svg'
import PDFIcon from '@/assets/icons/Docs/page.svg'
import ImageIcon from '@/assets/icons/Fotos y Videos/media-image.svg'
import ChatIcon from '@/assets/icons/Comunicacion/chat-lines.svg'

/**
 * Tabla de documentos completos por requisicion.
 */
const DocumentsByRequisition: React.FC = () => {
  const searchParams = useSearchParams()
  const requisitionId = searchParams.get('id') ?? undefined
  const { usePrincipalAlert } = usePrincipal()
  const { showAlert } = usePrincipalAlert

  const {
    billingDocumentByRequisition,
    loading,
    error,
    fetchBillingAllDocumentByRequisition,
  } = useBillingAllDocumentsByRequisitionStore(
    (s) => ({
      billingDocumentByRequisition: s.billingDocumentByRequisition,
      loading: s.loading,
      error: s.error,
      fetchBillingAllDocumentByRequisition: s.fetchBillingAllDocumentByRequisition,
    }),
    shallow,
  )

  const [panelOpen, setPanelOpen] = useState(false)
  const [selected, setSelected] = useState<BillingDocuments | null>(null)

  useEffect(() => {
    if (!requisitionId) return
    fetchBillingAllDocumentByRequisition(requisitionId, true)
  }, [requisitionId, fetchBillingAllDocumentByRequisition])

  useEffect(() => {
    if (!error) return
    showAlert({
      type: 'error',
      title: 'Error',
      description: String(error) || 'Hubo un problema desconocido',
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1500,
    })
  }, [error, showAlert])

  const mapFullToBillingDocument = (
    doc: BillingAllDocumentsByRequisition,
  ): BillingDocuments => ({
    requisitionkey: doc.requisition?.requisitionkey ?? '',
    id: doc.billingdocument_id ?? '',
    billingdocument_id: doc.billingdocument_id ?? '',
    requisition: doc.requisition,
    billingimages_id: doc.billingimages_id ?? '',
    xml: doc.xml ?? '',
    pdf: doc.pdf ?? '',
    image: doc.image ?? '',
    status: doc.status ?? '',
    comments: doc.comments ?? '',
    rfc_emisor: doc.rfc_emisor ?? '',
    rfc_receptor: doc.rfc_receptor ?? '',
    conceptos: Array.isArray(doc.conceptos) ? doc.conceptos : [],
    uuid: doc.uuid ?? '',
    fecha: doc.certification_date ?? doc.date_created ?? '',
    xmlinformation: doc.xmlinformation ?? '',
    date_created: doc.date_created ?? '',
    user_comments: doc.user_comments ?? '',
    forbidden_code: doc.forbidden_code ?? false,
    sat_validation: doc.sat_validation ?? false,
    billingAcuse: doc.billingAcuse ?? null,
    description: {
      id_billingdescription: doc.description?.id ?? '',
      name: doc.description?.name ?? '',
    },
    numpersons: doc.numpersons ?? 0,
    numnights: doc.numnights ?? 0,
    total: doc.total ?? 0,
    subtotal: doc.subtotal ?? 0,
    iva: doc.iva ?? 0,
    otherinvoices: doc.otherinvoices ?? 0,
    category: {
      id_billingcategory: doc.category?.id ?? '',
      name: doc.category?.name ?? '',
    },
    validatedbyoperations: doc.validatedbyoperations ?? false,
    authorization: doc.authorization ?? null,
  })

  const rows: BillingDocuments[] = useMemo(() => {
    if (!billingDocumentByRequisition) return []
    return [mapFullToBillingDocument(billingDocumentByRequisition)]
  }, [billingDocumentByRequisition])

  const handleOpenDetails = useCallback((row: BillingDocuments) => {
    setSelected(row)
    setPanelOpen(true)
  }, [])

  const columns: ColumnDefinition<BillingDocuments>[] = useMemo(
    () => [
      {
        key: 'xml' as keyof BillingDocuments,
        label: 'ARCHIVOS',
        cellClass: 'flex-[0_0_12%] min-w-0 text-left',
        headerClass: 'flex-[0_0_12%] min-w-0 text-left',
        render: (row) => (
          <div className="flex items-center gap-1">
            {row.xml && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={XMLIcon}
                onClick={() => window.open(row.xml, '_blank')}
                aria-label="Abrir XML"
                data-tour="ownrequisitions-detail-docs-xml"
              />
            )}
            {row.pdf && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={PDFIcon}
                onClick={() => window.open(row.pdf, '_blank')}
                aria-label="Abrir PDF"
                data-tour="ownrequisitions-detail-docs-pdf"
              />
            )}
            {row.image && (
              <Button
                size="xsmall"
                variant="ghost"
                icon={ImageIcon}
                onClick={() => window.open(row.image, '_blank')}
                aria-label="Abrir imagen"
                data-tour="ownrequisitions-detail-docs-image"
              />
            )}
          </div>
        ),
      },
      {
        key: 'fecha',
        label: 'FECHA',
        cellClass: 'flex-[0_0_18%] min-w-0 truncate text-left',
        headerClass: 'flex-[0_0_18%] min-w-0 text-left',
      },
      {
        key: 'category',
        label: 'CATEGORIA',
        cellClass: 'flex-[0_0_22%] min-w-0 truncate text-left',
        headerClass: 'flex-[0_0_22%] min-w-0 text-left',
        render: (row) => row.category?.name ?? '-',
      },
      {
        key: 'status',
        label: 'ESTATUS',
        cellClass: 'flex-[0_0_12%] min-w-0 text-right pr-4',
        headerClass: 'flex-[0_0_12%] min-w-0 text-right pr-4',
        render: (row) =>
          row.status ? (
            <Label
              type={row.status.toLocaleLowerCase() as any}
              text={row.status}
            />
          ) : (
            '-'
          ),
      },
      {
        key: 'comments' as keyof BillingDocuments,
        label: 'COMENTARIOS',
        cellClass: 'flex-[1_1_24%] min-w-0 truncate text-left pl-4',
        headerClass: 'flex-[1_1_24%] min-w-0 text-left pl-4',
        render: (row) =>
          row.user_comments || row.comments ? (
            <ChatIcon className="h-5 w-5 text-blue-60" />
          ) : null,
      },
      {
        key: 'acciones' as keyof BillingDocuments,
        label: 'VER DETALLE',
        cellClass: 'flex-[0_0_12%] min-w-0 text-center',
        headerClass: 'flex-[0_0_12%] min-w-0 text-right',
        render: (row) => {
          const hasDetails = Boolean(
            row.billingdocument_id ||
              row.id ||
              row.xml ||
              row.pdf ||
              row.image ||
              row.fecha ||
              row.category?.name ||
              row.status ||
              row.comments ||
              row.user_comments,
          )

          return hasDetails ? (
            <Button
              size="small"
              onClick={() => handleOpenDetails(row)}
              variant="ghost"
              hideIcon
              data-tour="ownrequisitions-detail-docs-view"
            >
              Ver detalle
            </Button>
          ) : null
        },
      },
    ],
    [handleOpenDetails],
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <LoadingOverlay
          open={Boolean(loading)}
          scope="container"
          message="Cargando documentos..."
        />
      </div>

      <div data-tour="ownrequisitions-detail-documents-table">
        <DataTable
          showCalendar={false}
          showFilter={false}
          showButton={false}
          enablePagination={false}
          textSize={{ mobile: "c2", desktop: "text-b3" }}
          tables={[
            {
              data: rows,
              columns,
              enableSelection: false,
              title: 'Reporte de gastos',
              enableCollaps: true,
              defaultSortKey: 'fecha',
              defaultSortDirection: 'desc',
            },
          ]}
        />
      </div>

      <DetailsPanel
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        selected={selected}
        operations
        reqisition={requisitionId}
      />
    </div>
  )
}

export default DocumentsByRequisition
