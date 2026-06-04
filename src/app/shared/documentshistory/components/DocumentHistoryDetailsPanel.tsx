"use client"

import React from "react"

import { Button } from "@/app/components/Button/Button"
import DetailsPanelLayout from "@/app/components/DetailsPanelLayout/DetailsPanelLayout"
import PDFIcon from "@/assets/icons/Docs/page.svg"
import XMLIcon from "@/assets/icons/Docs/privacy policy.svg"
import ImageIcon from "@/assets/icons/Fotos y Videos/media-image.svg"

import { resolveDocumentsHistoryStatusType } from "../constants"
import type {
  DocumentHistoryDetail,
  DocumentsHistoryListItem,
} from "../types"

type DocumentHistoryDetailsPanelProps = {
  open: boolean
  detail: DocumentHistoryDetail | null
  fallbackRow?: DocumentsHistoryListItem | null
  loading?: boolean
  integrationPending?: boolean
  onClose: () => void
}

const statusBadgeClassMap: Record<string, string> = {
  validado: "border-alert-green-100 bg-alert-green-10 text-alert-green-100",
  valido: "border-alert-green-100 bg-alert-green-10 text-alert-green-100",
  rechazado: "border-alert-red-100 bg-alert-red-10 text-alert-red-100",
  prohibido: "border-alert-red-100 bg-alert-red-10 text-alert-red-100",
  restringido: "border-gray-100 bg-gray-20 text-gray-100",
  pendiente: "border-alert-yellow-100 bg-alert-yellow-10 text-alert-yellow-100",
  "en-proceso":
    "border-alert-yellow-100 bg-alert-yellow-10 text-alert-yellow-100",
}

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
})

const formatDateTime = (value?: string) => {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}

const openDocument = (url?: string | null) => {
  if (!url) return
  window.open(url, "_blank", "noopener,noreferrer")
}

const buildStatusBadgeClassName = (status?: string) => {
  const normalizedStatusType = resolveDocumentsHistoryStatusType(status)

  return [
    "inline-flex items-center justify-center rounded-full border px-3 py-1",
    "text-[10px] font-semibold leading-[12px]",
    statusBadgeClassMap[normalizedStatusType] ??
      "border-alert-yellow-100 bg-alert-yellow-10 text-alert-yellow-100",
  ].join(" ")
}

export const DocumentHistoryDetailsPanel: React.FC<
  DocumentHistoryDetailsPanelProps
> = ({
  open,
  detail,
  fallbackRow,
  loading = false,
  integrationPending = false,
  onClose,
}) => {
  const currentRecord = detail ?? fallbackRow ?? null
  const concepts = detail?.concepts ?? []

  return (
    <DetailsPanelLayout
      open={open}
      onClose={onClose}
      leftLabel={
        currentRecord?.employeeName
          ? `Usuario: ${currentRecord.employeeName}`
          : undefined
      }
      rightLabel={
        currentRecord?.requisitionCode
          ? `Código de Solicitud: ${currentRecord.requisitionCode}`
          : undefined
      }
      contentClassName="flex h-full flex-col overflow-hidden px-[24px] pb-6 pt-2"
      label={() =>
        currentRecord?.status ? (
          <span className={buildStatusBadgeClassName(currentRecord.status)}>
            {currentRecord.status}
          </span>
        ) : null
      }
      renderActions={() => (
        <div className="flex items-center gap-2">
          {currentRecord?.xmlUrl && (
            <Button
              iconOnly
              size="small"
              variant="ghost"
              icon={XMLIcon}
              onClick={() => openDocument(currentRecord.xmlUrl)}
              aria-label="Abrir XML"
            />
          )}
          {currentRecord?.pdfUrl && (
            <Button
              iconOnly
              size="small"
              variant="ghost"
              icon={PDFIcon}
              onClick={() => openDocument(currentRecord.pdfUrl)}
              aria-label="Abrir PDF"
            />
          )}
          {currentRecord?.imageUrl && (
            <Button
              iconOnly
              size="small"
              variant="ghost"
              icon={ImageIcon}
              onClick={() => openDocument(currentRecord.imageUrl)}
              aria-label="Abrir imagen"
            />
          )}
        </div>
      )}
    >
      {integrationPending && !detail ? (
        <div className="rounded-xl border border-dashed border-gray-30 bg-white p-4 text-b3 text-gray-70">
          Integracion pendiente. Configura el endpoint de detalle para consultar la factura.
        </div>
      ) : loading && !detail ? (
        <div className="text-b3 text-gray-70">Cargando factura...</div>
      ) : detail ? (
        <div className="flex h-full min-h-0 flex-col text-gray-90">
          <div className="space-y-1">
            <div className="break-all text-s1 font-semibold leading-7 text-gray-90">
              {detail.uuid || "-"}
            </div>

            <div className="text-b4 font-medium leading-5 text-gray-90">
              FECHA Y HORA DE CERTIFICACIÓN:&nbsp;
              <span className="text-b3 font-normal leading-5 text-gray-90">
                {formatDateTime(detail.certificationDate)}
              </span>
            </div>

            <div className="pt-2 text-b4 font-medium leading-5 text-gray-90">
              RFC EMISOR:&nbsp;
              <span className="text-b3 font-normal leading-5 text-gray-90">
                {detail.rfcEmisor || "-"}
              </span>
            </div>

            <div className="text-b4 font-medium leading-5 text-gray-90">
              RFC RECEPTOR:&nbsp;
              <span className="text-b3 font-normal leading-5 text-gray-90">
                {detail.rfcReceptor || "-"}
              </span>
            </div>
          </div>

          <div className="mt-10 min-h-0 flex-1 overflow-y-auto pr-2">
            <div className="flex flex-col gap-3">
            {concepts.length > 0 ? (
              concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="space-y-0.5"
                >
                  <div className="text-b4 font-medium leading-5 text-gray-90">
                    CLAVE SAT:&nbsp;
                    <span className="text-b3 font-normal leading-5 text-gray-90">
                      {concept.satKey || "-"}
                    </span>
                  </div>
                  <div className="text-b4 font-medium leading-5 text-gray-90">
                    DESCRIPCIÓN:&nbsp;
                    <span className="text-b3 font-normal leading-5 text-gray-90">
                      {concept.description || "-"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-b3 text-gray-70">
                No hay conceptos disponibles para esta factura.
              </div>
            )}
            </div>
          </div>

          <div className="mt-5 h-px w-full shrink-0 bg-green-90" />

          <div className="ml-auto mt-4 flex min-w-[196px] shrink-0 gap-5 text-gray-90">
            <div className="text-b4 font-medium leading-5">
              <div>SUBTOTAL:</div>
              <div>TRASLADOS</div>
              <div>002 (IVA 16%):</div>
              <div>TOTAL:</div>
            </div>
            <div className="text-right text-b3 font-normal leading-5">
              <div>{currencyFormatter.format(detail.subtotal ?? 0)}</div>
              <div>&nbsp;</div>
              <div>{currencyFormatter.format(detail.iva ?? 0)}</div>
              <div>{currencyFormatter.format(detail.total ?? 0)}</div>
            </div>
          </div>

          {(detail.comments || detail.userComments) && (
            <div className="mt-6 shrink-0 text-b3 leading-5 text-gray-70">
              <span className="font-medium text-gray-90">Comentarios:&nbsp;</span>
              <span>{detail.comments?.trim() || detail.userComments?.trim() || "-"}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-b3 text-gray-70">
          Selecciona una factura para ver el detalle.
        </div>
      )}
    </DetailsPanelLayout>
  )
}

export default DocumentHistoryDetailsPanel
