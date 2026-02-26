'use client'

import React from 'react'
import Image from 'next/image'

import { Button } from '@/app/components/Button/Button'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { Input } from '@/app/components/Input/Input'
import { PopUp } from '@/app/components/PopUp/PopUp'
import { Select } from '@/app/components/Select/Select'
import SignaturePopUp from '@/app/components/SignaturePopUp/SignaturePopUp'
import DownloadIcon from '@/assets/icons/acciones/download.svg'
import LogoDR from '@/assets/images/Empresas/DR.png'
import LogoDisitrek from '@/assets/images/Empresas/DISITREK.jpg'
import LogoDisiva from '@/assets/images/Empresas/DISIVA.jpg'
import LogoItedesca from '@/assets/images/Empresas/ITEDESCA.jpg'
import LogoVip from '@/assets/images/Empresas/VIP.png'

import useRequisitionsAuthorization from './hooks/useRequisitionsAuthorization'

/**
 * Vista de autorización para requisiciones con resumen y acciones.
 */
const RequisitionsAuthorization = () => {
  const {
    requisitionId,
    requisition,
    rows,
    columns,
    periodLabel,
    verificationDate,
    requestedAmountLabel,
    verifiedAmountLabel,
    favorEmpresaLabel,
    favorColaboradorLabel,
    downloadRequistionResume,
    authorizerId,
    authorizationStatus,
    isPendingStatus,
    isRejectedStatus,
    authorizationComment,
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
  } = useRequisitionsAuthorization()

  const normalizeText = (value: string) =>
    value
      .toLocaleLowerCase('es-MX')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

  const enterpriseHint = [
    requisition?.state,
    requisition?.projectname,
    requisition?.gts_type,
  ]
    .filter((value) => value && String(value).trim() !== '')
    .join(' ')

  const normalizedEnterprise = normalizeText(enterpriseHint)

  const logoSource = (() => {
    if (normalizedEnterprise.includes('disitrek')) return LogoDisitrek
    if (normalizedEnterprise.includes('disiva')) return LogoDisiva
    if (normalizedEnterprise.includes('itedesca')) return LogoItedesca
    if (normalizedEnterprise.includes('vip')) return LogoVip
    if (normalizedEnterprise.includes('dr')) return LogoDR
    return LogoDR
  })()

  const logoAlt = (() => {
    if (normalizedEnterprise.includes('disitrek')) return 'Logo Disitrek'
    if (normalizedEnterprise.includes('disiva')) return 'Logo Disiva'
    if (normalizedEnterprise.includes('itedesca')) return 'Logo Itedesca'
    if (normalizedEnterprise.includes('vip')) return 'Logo VIP'
    return 'Logo DR'
  })()

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-[240px] flex-1 items-center gap-3">
          <p className="text-b3 text-blue-80">
            Reporte de gastos{' '}
            <span className="font-semibold text-blue-100">
              {requisition?.requisitionkey ?? '—'}
            </span>
          </p>
          <div className="hidden h-px flex-1 bg-blue-40 md:block" />
        </div>

        {isPendingStatus && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="medium"
              hideIcon
              className="border-alert-red-100 text-alert-red-100 hover:bg-alert-red-10 focus:ring-alert-red-50"
              onClick={handleStartRejection}
            >
              Rechazar
            </Button>
            <Button variant="solid" size="medium" hideIcon onClick={handleStartApproval}>
              Aprobar
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)_minmax(0,280px)]">
        <div className="rounded-lg bg-white-100 p-4 shadow-200">
          <div className="flex h-16 items-center justify-center rounded-md bg-gray-10 px-4">
            <Image
              src={logoSource}
              alt={logoAlt}
              className="h-full w-auto object-contain"
              priority={false}
            />
          </div>
          <p className="mt-4 text-c2 text-gray-70">Periodo: {periodLabel}</p>
        </div>

        <div className="rounded-lg bg-white-100 p-4 shadow-200">
          <p className="text-b3 text-gray-80">
            Fecha de comprobación: {verificationDate}
          </p>
          <p className="mt-3 text-b3 text-gray-80">Motivo de viaje: {requisition?.motive ?? '—'}</p>
          <p className="mt-3 text-b3 text-gray-80">
            Nombre beneficiario: {requisition?.employeename ?? '—'}
          </p>
        </div>

        <div className="rounded-lg bg-white-100 p-4 shadow-200">
          <p className="text-b3 text-gray-80">Monto solicitado: {requestedAmountLabel}</p>
          <p className="mt-2 text-b3 text-gray-80">Monto comprobado: {verifiedAmountLabel}</p>
          <p className="mt-2 text-b3 text-gray-80">Monto a favor de la empresa: {favorEmpresaLabel}</p>
          <p className="mt-2 text-b3 text-gray-80">Monto a favor del colaborador: {favorColaboradorLabel}</p>
          {!isPendingStatus && authorizationStatus ? (
            <p className="mt-2 text-b3 text-gray-80">Estatus: {authorizationStatus}</p>
          ) : null}
        </div>
      </div>

      {isPendingStatus ? (
        <div className="flex justify-end">
          <Button variant="outline" size="medium" hideIcon onClick={handleOpenEscalate}>
            Escalar
          </Button>
        </div>
      ) : null}

      {isRejectedStatus && authorizationComment ? (
        <div className="rounded-lg bg-white-100 p-4 text-b3 text-gray-80 shadow-200">
          Comentarios: {authorizationComment}
        </div>
      ) : null}

      <DataTable
        showCalendar={false}
        showFilter={false}
        showRefresh={false}
        showButton={false}
        showDownloadTable={false}
        enableInternalSearch={false}
        enablePagination
        actionLabel=""
        actionsRender={() => (
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              hideIcon
              onClick={() => {
                if (requisitionId) downloadRequistionResume(requisitionId)
              }}
            >
              Descargar tabla completa
            </Button>
            <Button
              variant="outline"
              size="small"
              icon={DownloadIcon}
              iconOnly
              onClick={() => {
                if (requisitionId) downloadRequistionResume(requisitionId)
              }}
              aria-label="Descargar tabla completa"
            />
          </div>
        )}
        tables={[
          {
            data: rows,
            columns,
            title: 'Reporte de gastos',
            hidetitle: true,
            enableSelection: false,
            enableCollaps: false,
          },
        ]}
      />
      {/*
        Tabla alternativa (se mantiene comentada por si se decide usarla nuevamente).
        <RequisitionsDetailsTable requisitionIdOverride={requisitionId ?? undefined} />
      */}

      <SignaturePopUp
        open={signatureOpen}
        onClose={() => setSignatureOpen(false)}
        onAuthorization={handleSignatureAuthorization}
        responsibleGuid={authorizerId ?? ''}
      />

      <PopUp
        open={rejectCommentOpen}
        onClose={handleRejectCommentCancel}
        title="Rechazar solicitud de requisición"
        content="Deja aquí un comentario para que el solicitante sepa la razón del rechazo de la requisición."
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
        title="Solicitud de requisición"
        content="Selecciona al responsable de la aprobación de tu solicitud de requisición."
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

export default RequisitionsAuthorization
