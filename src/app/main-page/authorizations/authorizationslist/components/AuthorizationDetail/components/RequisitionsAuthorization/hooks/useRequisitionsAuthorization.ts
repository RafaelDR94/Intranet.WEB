import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { shallow } from 'zustand/shallow'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { BillingDocumentDetailsTableListMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocumentDetailsTable } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { formatCurrency, parseMoney } from '@/app/utilities/FormatHelpers/FormatHelpets'
import { formatDMY } from '@/app/utilities/DatesHelper/Dateshelper'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'
import { useBillingDocumentsStore } from '@/app/stores/useBillingDocumentsStore/useBillingDocumentsStore'
import type { Requisition } from '@/app/mappings/requisitions/requisitions.types'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import type { Authorized } from '@/app/components/SignaturePopUp/types'
import { useAuthorizationsStore } from '@/app/stores/useAuthorizationsStore/useAuthorizationsStore'
import type { SelectOption } from '@/app/components/Select/types'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'

export type RequisitionAuthorizationRow = {
  id: string
  displayId: string
  consumptionDate: string
  provider: string
  description: string
  persons: string
  nights: string
  invoice: string
  subtotal: string
  iva: string
  others: string
  total: string
}

const formatDateSafe = (value?: string): string => {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return formatDMY(d)
}

const buildPeriod = (requisition: Requisition | null) => {
  if (!requisition) return '-'
  if (requisition.period) return requisition.period
  const start = formatDateSafe(requisition.assignmentdate)
  const end = formatDateSafe(requisition.endDate)
  if (start === '-' && end === '-') return '-'
  return `${start} al ${end}`
}

const buildAmountLabel = (value: number, showDashWhenZero = false) => {
  if (showDashWhenZero && !value) return '-'
  return formatCurrency(value)
}

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase('es-MX')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

/**
 * Hook que orquesta el detalle de autorizaciones de requisiciones.
 */
const useRequisitionsAuthorization = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const authorizationId =
    searchParams.get('authorization_id') || searchParams.get('id') || undefined
  const requisitionId = searchParams.get('event_id') ?? undefined
  const useAuthorizationDocuments = searchParams.get('documents') === 'authorization'
  const attemptedRef = useRef<string | null>(null)
  const billingAttemptedRef = useRef<string | null>(null)
  const redirectedRef = useRef(false)
  const billingErrorShownRef = useRef<string | null>(null)

  const [signatureOpen, setSignatureOpen] = useState(false)
  const [rejectCommentOpen, setRejectCommentOpen] = useState(false)
  const [rejectComment, setRejectComment] = useState('')
  const [rejectCommentError, setRejectCommentError] = useState<string | null>(null)
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null)
  const [authorizerPopUpOpen, setAuthorizerPopUpOpen] = useState(false)
  const [authorizerSelected, setAuthorizerSelected] = useState('')
  const [authorizerError, setAuthorizerError] = useState<string | null>(null)

  const {
    authorizations,
    authorizationBillingDocuments,
    loadingBillingDocuments,
    getAuthorizationBillingDocuments,
    getAuthorizations,
    approveAuthorization,
    rejectAuthorization,
    updateAuthorizationAuthorizer,
  } = useAuthorizationsStore(
    (state) => ({
      authorizations: state.authorizations,
      authorizationBillingDocuments: state.authorizationBillingDocuments,
      loadingBillingDocuments: state.loadingBillingDocuments,
      getAuthorizationBillingDocuments: state.getAuthorizationBillingDocuments,
      getAuthorizations: state.getAuthorizations,
      approveAuthorization: state.approveAuthorization,
      rejectAuthorization: state.rejectAuthorization,
      updateAuthorizationAuthorizer: state.updateAuthorizationAuthorizer,
    }),
    shallow,
  )

  const {
    currentRequisition,
    gettincurrentReq,
    error,
    fetchCurrentRequisition,
    resetCurrentReq,
    resetFlags,
    downloadRequistionResume,
    downloadingDocument,
    succesDownloadDocument,
  } = useRequisitionsStore(
    (state) => ({
      currentRequisition: state.currentRequisition,
      gettincurrentReq: state.gettincurrentReq,
      error: state.error,
      fetchCurrentRequisition: state.fetchCurrentRequisition,
      resetCurrentReq: state.resetCurrentReq,
      resetFlags: state.resetFlags,
      downloadRequistionResume: state.downloadRequistionResume,
      downloadingDocument: state.downloadingDocument,
      succesDownloadDocument: state.succesDownloadDocument,
    }),
    shallow,
  )

  const {
    billingDocuments,
    billingLoading,
    billingError,
    fetchBillingDocumentByIdRequisition,
    resetBillingFlags,
  } = useBillingDocumentsStore(
    (state) => ({
      billingDocuments: state.billingDocuments,
      billingLoading: state.loading,
      billingError: state.error,
      fetchBillingDocumentByIdRequisition: state.fetchBillingDocumentByIdRequisition,
      resetBillingFlags: state.resetFlags,
    }),
    shallow,
  )

  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  const { employees, employeesError, fetchEmployees } = useEmployeesStore(
    (state) => ({
      employees: state.employees,
      employeesError: state.error,
      fetchEmployees: state.fetchEmployees,
    }),
    shallow,
  )

  const authorization = useMemo(
    () =>
      authorizationId
        ? authorizations.find((item) => item.authorization_id === authorizationId)
        : undefined,
    [authorizationId, authorizations],
  )

  const authorizerId = authorization?.authorizer?.employee_id || authorization?.authorizer?.id || ''

  const authorizationStatus =
    (typeof authorization?.status === 'string'
      ? authorization?.status
      : authorization?.status?.name) ??
    currentRequisition?.status ??
    'Pendiente'
  const normalizedStatus = normalizeText(authorizationStatus)
  const isPendingStatus = normalizedStatus.includes('pend')
  const isRejectedStatus = normalizedStatus.includes('rechaz')
  const authorizationComment = authorization?.comment ?? ''

  useEffect(() => {
    if (gettincurrentReq || downloadingDocument || billingLoading || loadingBillingDocuments) {
      showSpinner({ message: 'Obteniendo detalle de requisicion...' })
      return
    }

    hideSpinner()

    const hasNotFound =
      typeof error === 'string' &&
      (error.toLowerCase().includes('no encontrado') || error.toLowerCase().includes('not found'))

    if (error && !redirectedRef.current) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo cargar la requisicion',
        description: String(error),
        showPrimaryButton: true,
        primaryLabel: hasNotFound ? 'Regresar' : 'Entendido',
        onPrimaryClick: () => {
          hideAlert()
          if (hasNotFound) {
            const base = pathname.split('?')[0]
            const clean = base.endsWith('/') ? base.slice(0, -1) : base
            router.push(clean)
            redirectedRef.current = true
          }
        },
        showSecondaryButton: true,
        secondaryLabel: hasNotFound ? 'Cerrar' : 'Reintentar',
        onSecondaryClick: () => {
          hideAlert()
          if (!hasNotFound && requisitionId) fetchCurrentRequisition(requisitionId)
        },
      })
      resetFlags()
    }

    if (
      billingError &&
      !useAuthorizationDocuments &&
      requisitionId &&
      billingErrorShownRef.current !== requisitionId
    ) {
      billingErrorShownRef.current = requisitionId
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudieron cargar los documentos',
        description: String(billingError),
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
        showSecondaryButton: true,
        secondaryLabel: 'Reintentar',
        onSecondaryClick: () => {
          hideAlert()
          fetchBillingDocumentByIdRequisition(requisitionId, true)
        },
      })
      resetBillingFlags()
    }

    if (succesDownloadDocument) {
      showAlert({
        type: 'info',
        variant: 'filled',
        title: 'Descarga completa',
        description: 'Se descargo correctamente el documento.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
      })
      resetFlags()
    }
  }, [
    billingError,
    billingLoading,
    loadingBillingDocuments,
    downloadingDocument,
    error,
    fetchBillingDocumentByIdRequisition,
    fetchCurrentRequisition,
    gettincurrentReq,
    hideAlert,
    hideSpinner,
    pathname,
    requisitionId,
    useAuthorizationDocuments,
    resetBillingFlags,
    resetFlags,
    router,
    showAlert,
    showSpinner,
    succesDownloadDocument,
  ])

  useEffect(() => {
    if (!requisitionId) {
      resetCurrentReq()
      return
    }

    if (attemptedRef.current === requisitionId || redirectedRef.current) {
      return
    }

    attemptedRef.current = requisitionId
    fetchCurrentRequisition(requisitionId)
  }, [fetchCurrentRequisition, requisitionId, resetCurrentReq])

  useEffect(() => {
    if (useAuthorizationDocuments) return
    if (!requisitionId) return
    if (billingAttemptedRef.current === requisitionId) return

    billingAttemptedRef.current = requisitionId
    fetchBillingDocumentByIdRequisition(requisitionId, true)
  }, [fetchBillingDocumentByIdRequisition, requisitionId, useAuthorizationDocuments])

  useEffect(() => {
    if (!useAuthorizationDocuments) return
    if (!authorizationId) return
    if (billingAttemptedRef.current === authorizationId) return

    billingAttemptedRef.current = authorizationId
    getAuthorizationBillingDocuments(authorizationId, true)
  }, [authorizationId, getAuthorizationBillingDocuments, useAuthorizationDocuments])

  useEffect(() => {
    if (!authorizationId) return
    if (authorization) return
    getAuthorizations()
  }, [authorization, authorizationId, getAuthorizations])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  useEffect(() => {
    if (!employeesError) return
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudo cargar la lista de empleados',
      description: String(employeesError) || 'Intenta refrescar.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
    })
  }, [employeesError, hideAlert, showAlert])

  const handleStartApproval = useCallback(() => {
    if (!authorizationId || !authorizerId) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se puede continuar',
        description: 'No se encontro el autorizador.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      })
      return
    }

    setPendingAction('approve')
    setSignatureOpen(true)
  }, [authorizationId, authorizerId, hideAlert, showAlert])

  const handleStartRejection = useCallback(() => {
    if (!authorizationId || !authorizerId) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se puede continuar',
        description: 'No se encontro el autorizador.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
      })
      return
    }

    setPendingAction('reject')
    setSignatureOpen(true)
  }, [authorizationId, authorizerId, hideAlert, showAlert])

  const handleSignatureAuthorization = useCallback(
    async (authorized: Authorized) => {
      if (!authorized?.state) {
        setSignatureOpen(false)
        setPendingAction(null)
        return
      }

      setSignatureOpen(false)

      if (pendingAction === 'approve') {
        showSpinner({ message: 'Aprobando autorizacion...' })
        const success = await approveAuthorization(authorizationId ?? '')
        hideSpinner()

        showAlert({
          type: success ? 'success' : 'error',
          variant: 'filled',
          title: success ? 'Autorizacion aprobada' : 'No se pudo aprobar',
          description: success
            ? 'La autorizacion fue aprobada correctamente.'
            : 'Ocurrio un error al aprobar la autorizacion.',
          showPrimaryButton: true,
          primaryLabel: 'Entendido',
          onPrimaryClick: hideAlert,
        })

        setPendingAction(null)
        return
      }

      if (pendingAction === 'reject') {
        setRejectCommentOpen(true)
      }
    },
    [
      approveAuthorization,
      authorizationId,
      hideAlert,
      hideSpinner,
      pendingAction,
      showAlert,
      showSpinner,
    ],
  )

  const handleRejectCommentChange = useCallback(
    (value: string) => {
      setRejectComment(value)
      if (rejectCommentError) setRejectCommentError(null)
    },
    [rejectCommentError],
  )

  const handleRejectCommentCancel = useCallback(() => {
    setRejectCommentOpen(false)
    setRejectComment('')
    setRejectCommentError(null)
    setPendingAction(null)
    showAlert({
      type: 'info',
      variant: 'filled',
      title: 'Accion cancelada',
      description: 'Se cancelo el cambio de status en la autorizacion.',
      showPrimaryButton: false,
      showSecondaryButton: false,
      autoCloseMs: 1800,
    })
  }, [showAlert])

  const handleRejectCommentSubmit = useCallback(async () => {
    const trimmed = rejectComment.trim()
    if (!trimmed) {
      setRejectCommentError('Agrega un comentario para continuar.')
      return
    }

    showSpinner({ message: 'Rechazando autorizacion...' })
    const success = await rejectAuthorization(authorizationId ?? '', trimmed)
    hideSpinner()

    showAlert({
      type: success ? 'success' : 'error',
      variant: 'filled',
      title: success ? 'Autorizacion rechazada' : 'No se pudo rechazar',
      description: success
        ? 'La autorizacion fue rechazada correctamente.'
        : 'Ocurrio un error al rechazar la autorizacion.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
    })

    setRejectCommentOpen(false)
    setRejectComment('')
    setRejectCommentError(null)
    setPendingAction(null)
  }, [
    authorizationId,
    hideAlert,
    hideSpinner,
    rejectAuthorization,
    rejectComment,
    showAlert,
    showSpinner,
  ])

  const authorizerOptions = useMemo<SelectOption[]>(
    () =>
      (employees ?? []).map((employee) => ({
        label: employee.fullname,
        value: employee.employee_id,
      })),
    [employees],
  )

  useEffect(() => {
    if (authorizerSelected) return
    if (!authorizerOptions.length) return
    setAuthorizerSelected(authorizerOptions[0].value)
  }, [authorizerOptions, authorizerSelected])

  useEffect(() => {
    if (authorizerSelected && authorizerError) {
      setAuthorizerError(null)
    }
  }, [authorizerError, authorizerSelected])

  const handleOpenEscalate = useCallback(() => {
    setAuthorizerError(null)
    setAuthorizerPopUpOpen(true)
  }, [])

  const handleCancelEscalate = useCallback(() => {
    setAuthorizerPopUpOpen(false)
    setAuthorizerError(null)
  }, [])

  const handleConfirmEscalate = useCallback(async () => {
    if (!authorizationId) {
      setAuthorizerPopUpOpen(false)
      return
    }

    if (!authorizerSelected) {
      setAuthorizerError('Selecciona un autorizador.')
      return
    }

    showSpinner({ message: 'Escalando autorizacion...' })
    const success = await updateAuthorizationAuthorizer(authorizationId, {
      authorizer_id: authorizerSelected,
    })
    hideSpinner()

    if (success) {
      setAuthorizerPopUpOpen(false)
      showAlert({
        type: 'success',
        variant: 'filled',
        title: 'Solicitud enviada',
        description: 'La autorizacion se escalo correctamente.',
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1800,
        onClose: hideAlert,
      })
      const base = pathname.split('?')[0]
      const clean = base.endsWith('/') ? base.slice(0, -1) : base
      router.push(clean)
      return
    }

    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudo escalar',
      description: 'Ocurrio un error al escalar la autorizacion.',
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
    })
  }, [
    authorizerSelected,
    authorizationId,
    hideAlert,
    hideSpinner,
    pathname,
    router,
    showAlert,
    showSpinner,
    updateAuthorizationAuthorizer,
  ])

  const rows: RequisitionAuthorizationRow[] = useMemo(() => {
    const source = useAuthorizationDocuments
      ? authorizationBillingDocuments ?? []
      : billingDocuments ?? []
    const mapped = BillingDocumentDetailsTableListMap(source)
    return mapped.map((doc: BillingDocumentDetailsTable, index: number) => ({
      id: doc.billingdocument_id || `row-${index + 1}`,
      displayId: String(index + 1),
      consumptionDate: formatDateSafe(doc.fecha),
      provider: doc.rfc_emisor ?? '-',
      description: doc.description ?? '-',
      persons: doc.numpersons ? String(doc.numpersons) : 'N/A',
      nights: doc.numnights ? String(doc.numnights) : 'N/A',
      invoice: doc.uuid ?? doc.billingdocument_id ?? '-',
      subtotal: formatCurrency(doc.subtotal ?? 0),
      iva: formatCurrency(doc.iva ?? 0),
      others: formatCurrency(doc.otherinvoices ?? 0),
      total: formatCurrency(doc.total ?? 0),
    }))
  }, [authorizationBillingDocuments, billingDocuments, useAuthorizationDocuments])

  const columns: ColumnDefinition<RequisitionAuthorizationRow>[] = useMemo(
    () => [
      { key: 'displayId', label: 'ID', cellClass: 'w-1/15 text-center', headerClass: 'w-1/15 text-center' },
      { key: 'consumptionDate', label: 'FECHA CONSUMO', cellClass: 'w-2/15 text-center', headerClass: 'w-2/15 text-center' },
      { key: 'provider', label: 'PROVEEDOR', cellClass: 'w-2/15 text-center', headerClass: 'w-2/15 text-center' },
      { key: 'description', label: 'DESCRIPCION', cellClass: 'w-2/15 text-center', headerClass: 'w-2/15 text-center' },
      { key: 'persons', label: 'No. PERS.', cellClass: 'w-1/15 text-center', headerClass: 'w-1/15 text-center' },
      { key: 'nights', label: 'No. NOCHES', cellClass: 'w-1/15 text-center', headerClass: 'w-1/15 text-center' },
      { key: 'invoice', label: 'No. FACTURA/TICKET/REMISION', cellClass: 'w-3/15  text-center truncate', headerClass: 'w-3/15 text-center truncate' },
      { key: 'subtotal', label: 'SUBTOTAL', cellClass: 'w-1/15 text-center', headerClass: 'w-1/15 text-center' },
      { key: 'iva', label: 'IVA', cellClass: 'w-1/15 text-center', headerClass: 'w-1/15 text-center' },
      { key: 'others', label: 'OTROS IMP.', cellClass: 'w-1/15 text-center', headerClass: 'w-1/15 text-center' },
      { key: 'total', label: 'TOTAL', cellClass: 'w-1/15 text-center', headerClass: 'w-1/15 text-center' },
    ],
    [],
  )

  const requestedAmount = parseMoney(currentRequisition?.amountdeposited)
  const verifiedAmount = parseMoney(currentRequisition?.provenamount)
  const differenceAmount = parseMoney(currentRequisition?.amountdifference)

  const favorEmpresa = differenceAmount > 0 ? differenceAmount : 0
  const favorColaborador = differenceAmount < 0 ? Math.abs(differenceAmount) : 0

  return {
    requisitionId,
    requisition: currentRequisition,
    rows,
    columns,
    periodLabel: buildPeriod(currentRequisition),
    verificationDate: formatDateSafe(currentRequisition?.date_created),
    requestedAmountLabel: buildAmountLabel(requestedAmount),
    verifiedAmountLabel: buildAmountLabel(verifiedAmount),
    favorEmpresaLabel: buildAmountLabel(favorEmpresa, true),
    favorColaboradorLabel: buildAmountLabel(favorColaborador, true),
    authorizationStatus,
    isPendingStatus,
    isRejectedStatus,
    authorizationComment,
    authorizerId,
    signatureOpen,
    setSignatureOpen,
    rejectCommentOpen,
    rejectComment,
    rejectCommentError,
    handleStartApproval,
    handleStartRejection,
    handleSignatureAuthorization,
    handleRejectCommentChange,
    handleRejectCommentSubmit,
    handleRejectCommentCancel,
    authorizerPopUpOpen,
    authorizerSelected,
    authorizerOptions,
    authorizerError,
    handleOpenEscalate,
    handleCancelEscalate,
    handleConfirmEscalate,
    setAuthorizerSelected,
    downloadRequistionResume,
  }
}

export default useRequisitionsAuthorization
