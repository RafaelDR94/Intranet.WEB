"use client"

import React from 'react'

import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { Input } from '@/app/components/Input/Input'
import Label from '@/app/components/Label/Label'
import { PopUp } from '@/app/components/PopUp/PopUp'
import { Select } from '@/app/components/Select/Select'
import SignaturePopUp from '@/app/components/SignaturePopUp/SignaturePopUp'
import PDFIcon from '@/assets/icons/Docs/page.svg'
import XMLIcon from '@/assets/icons/Docs/privacy policy.svg'
import ImageIcon from '@/assets/icons/Fotos y Videos/media-image.svg'
import TicketsBlue from '@/assets/svgs/TicketAzul.svg'
import TicketsPink from '@/assets/svgs/TicketsRosa.svg'

import useValesAuthorization from './hooks/useValesAuthorization'

const filterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Vale Rosa', value: 'vale rosa' },
  { label: 'Vale Azul', value: 'vale azul' },
  { label: 'Aprobado', value: 'aprobado' },
  { label: 'Pendiente', value: 'pendiente' },
  { label: 'Rechazado', value: 'rechazado' },
]

/**
 * Vista de autorización para vales de caja chica.
 */
const ValesAuthorization = () => {
  const {
    title,
    voucher,
    rows,
    columns,
    activeFilter,
    setActiveFilter,
    statusLabelType,
    voucherLabelType,
    formattedAmount,
    formattedSubtotal,
    formattedIva,
    formattedTotal,
    formattedDate,
    projectCode,
    collaborator,
    voucherUuid,
    rfcEmisor,
    rfcReceptor,
    concept,
    authorizerId,
    authorizationStatus,
    isPendingStatus,
    isRejectedStatus,
    authorizationComment,
    attachments,
    signatureOpen,
    setSignatureOpen,
    rejectCommentOpen,
    rejectComment,
    rejectCommentError,
    authorizerPopUpOpen,
    authorizerSelected,
    authorizerOptions,
    authorizerError,
    handleStartApproval,
    handleStartRejection,
    handleSignatureAuthorization,
    handleRejectCommentChange,
    handleRejectCommentSubmit,
    handleRejectCommentCancel,
    handleOpenEscalate,
    handleCancelEscalate,
    handleConfirmEscalate,
    setAuthorizerSelected,
  } = useValesAuthorization()

  const isPink = voucherLabelType === 'vale-rosa'
  const TicketIcon = isPink ? TicketsPink : TicketsBlue


  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4" data-tour="authorizations-vale-header">
        <div className="flex min-w-[240px] flex-1 items-center gap-3 md:pr-6">
          <p className="text-b3 text-blue-80">{title}</p>
          <div className="hidden h-px flex-1 bg-blue-40 md:block" />
        </div>

        {isPendingStatus && (
          <div className="flex items-center gap-3 md:pl-2">
            <Button
              variant="outline"
              size="medium"
              hideIcon
              className="border-alert-red-100 text-alert-red-100 hover:bg-alert-red-10 focus:ring-alert-red-50"
              onClick={handleStartRejection}
              data-tour="authorizations-vale-reject"
            >
              Rechazar
            </Button>
            <Button
              variant="solid"
              size="medium"
              hideIcon
              onClick={handleStartApproval}
              data-tour="authorizations-vale-approve"
            >
              Aprobar
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-white-100 p-6 shadow-200" data-tour="authorizations-vale-summary">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.05fr)_minmax(0,0.7fr)]">
          <div className="space-y-3 text-b3 text-gray-80">
            <p className="text-b3 text-blue-80">Colaborador: {collaborator}</p>
            <p className="text-s1 font-semibold text-gray-90">{voucherUuid}</p>
            <p>RFC EMISOR: {rfcEmisor}</p>
            <p>CONCEPTO: {concept}</p>
          </div>

          <div className="space-y-3 text-b3 text-gray-80">
            <p className="text-b3 text-blue-80">Codigo de Proyecto: {projectCode}</p>
            <p>FECHA Y HORA DE CERTIFICACION: {formattedDate}</p>
            <p>RFC RECEPTOR: {rfcReceptor}</p>
            <div className="space-y-1">
              <p>SUBTOTAL: {formattedSubtotal}</p>
              <p>(IVA 16%): {formattedIva}</p>
              <p className="font-semibold">TOTAL: {formattedTotal}</p>
            </div>
          </div>

          <div className="flex h-full flex-col items-end gap-3 text-b3 text-gray-80">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Label type={statusLabelType} text={authorizationStatus ?? voucher?.status ?? 'Pendiente'} />
              <div className="flex items-center gap-2" data-tour="authorizations-vale-attachments">
                {attachments.evidence && (
                  <Button
                    variant="ghost"
                    size="xsmall"
                    icon={ImageIcon}
                    iconOnly
                    aria-label="Ver evidencia"
                    onClick={() => window.open(attachments.evidence!, '_blank')}
                  />
                )}
                {attachments.xml && (
                  <Button
                    variant="ghost"
                    size="xsmall"
                    icon={XMLIcon}
                    iconOnly
                    aria-label="Ver XML"
                    onClick={() => window.open(attachments.xml!, '_blank')}
                  />
                )}
                {attachments.pdf && (
                  <Button
                    variant="ghost"
                    size="xsmall"
                    icon={PDFIcon}
                    iconOnly
                    aria-label="Ver PDF"
                    onClick={() => window.open(attachments.pdf!, '_blank')}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <TicketIcon aria-hidden="true" />
            </div>
          </div>
        </div>

        {isRejectedStatus && authorizationComment && (
          <div className="mt-4 rounded-md bg-gray-10 p-3 text-b3 text-gray-70">
            Comentarios: {authorizationComment}
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Input label="Monto" value={formattedAmount} disabled variant="disabled" />
          <Input label="Fecha" value={formattedDate} disabled variant="disabled" />
          <Input label="Concepto" value={concept} disabled variant="disabled" />
        </div>

        {isPendingStatus && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="medium"
              hideIcon
              onClick={handleOpenEscalate}
              data-tour="authorizations-vale-escalate"
            >
              Escalar
            </Button>
          </div>
        )}
      </div>

      <div data-tour="authorizations-vale-history-table">
        <DataTable
          showCalendar
          showFilter
          showRefresh={false}
          showButton={false}
          showDownloadTable={false}
          enableInternalSearch
          filterTitle="Filtrar vales"
          filterOptions={filterOptions}
          filterValue={activeFilter}
          onFilterChange={(value) => setActiveFilter(value)}
          searchableKeys={['collaborator', 'concept', 'voucherType', 'status']}
          dateKey={(row) => row.applicationDate}
          searchDataTour="authorizations-vale-search"
          calendarDataTour="authorizations-vale-calendar"
          filterDataTour="authorizations-vale-filter"
          tables={[
            {
              data: rows,
              columns,
              title: 'Historial de solicitudes caja chica',
              enableSelection: false,
              enableCollaps: false,
            },
          ]}
        />
      </div>

      <SignaturePopUp
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        onAuthorization={handleSignatureAuthorization}
        responsibleGuid={authorizerId ?? ''}
      />

      <PopUp
        open={rejectCommentOpen}
        onClose={handleRejectCommentCancel}
        title="Rechazar solicitud de vale"
        content="Deja aquí un comentario para que el solicitante sepa la razón del rechazo del vale."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleRejectCommentCancel}
        showPrimaryButton
        primaryButtonText="Enviar Comentario"
        onPrimaryButtonClick={handleRejectCommentSubmit}
      >
        <Input
          as="textarea"
          placeholder="Escribir comentario"
          value={rejectComment}
          onChange={(event) => handleRejectCommentChange(event.target.value)}
          variant={rejectCommentError ? 'error' : 'default'}
          helperText={rejectCommentError ?? undefined}
          rows={4}
        />
      </PopUp>

      <PopUp
        open={authorizerPopUpOpen}
        onClose={handleCancelEscalate}
        title="Solicitud de vale"
        content="Selecciona al responsable de la aprobación de tu solicitud de vale."
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={handleCancelEscalate}
        showPrimaryButton
        primaryButtonText="Enviar solicitud"
        onPrimaryButtonClick={handleConfirmEscalate}
      >
        <Select
          label="Autorizador"
          placeholder="Selecciona una opción"
          options={authorizerOptions}
          selected={authorizerSelected ? [authorizerSelected] : []}
          onChange={(values) => {
            const next = Array.isArray(values) ? values[0] ?? '' : ''
            setAuthorizerSelected(next)
          }}
        />
        {authorizerError ? (
          <p className="mt-2 text-b4 text-alert-red-100">{authorizerError}</p>
        ) : null}
      </PopUp>
    </section>
  )
}

export default ValesAuthorization
