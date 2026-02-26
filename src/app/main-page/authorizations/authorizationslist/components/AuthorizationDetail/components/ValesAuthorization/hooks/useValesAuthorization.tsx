import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { shallow } from 'zustand/shallow'

import type { ColumnDefinition } from '@/app/components/DataTable/types'
import type { SelectOption } from '@/app/components/Select/types'
import Label from '@/app/components/Label/Label'
import type { LabelType } from '@/app/components/Label/types'
import type { Authorized } from '@/app/components/SignaturePopUp/types'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import type {
  PettyCashVoucherData,
  PettyCashVoucherFull,
} from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { useAuthorizationsStore } from '@/app/stores/useAuthorizationsStore/useAuthorizationsStore'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'
import { useBillingPettyCash } from '@/app/stores/useBillingPettyCash/useBillingPettyCash'
import { useEmployeesStore } from '@/app/stores/useEmployeesStore/useEmployeesStore'
import { formatDMY } from '@/app/utilities/DatesHelper/Dateshelper'
import { formatCurrency, parseMoney } from '@/app/utilities/FormatHelpers/FormatHelpets'

export type ValesHistoryRow = {
  id: string
  collaborator: string
  applicationDate: string
  concept: string
  voucherType: string
  voucherLabelType: LabelType
  amountLabel: string
  status: string
  statusLabelType: LabelType
}

const normalizeText = (value: string) =>
  value
    .toLocaleLowerCase('es-MX')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const formatDateSafe = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return formatDMY(date)
}

const statusToLabelType = (status?: string): LabelType => {
  const normalized = normalizeText(status ?? '')
  if (!normalized) return 'pendiente'
  if (normalized.includes('rechaz')) return 'rechazado'
  if (normalized.includes('aprob') || normalized.includes('valid')) return 'valido'
  if (normalized.includes('pend')) return 'pendiente'
  if (normalized.includes('proceso')) return 'en-proceso'
  if (normalized.includes('factura rechazada')) return 'factura-rechazada'
  if (normalized.includes('sin factura')) return 'sin-factura'
  return 'actualizado'
}

const voucherTypeToLabelType = (voucherType?: string): LabelType => {
  const normalized = normalizeText(voucherType ?? '')
  if (normalized.includes('rosa')) return 'vale-rosa'
  if (normalized.includes('azul')) return 'vale-azul'
  return 'restringido'
}

const pickVoucherTotal = (voucher?: PettyCashVoucherData | PettyCashVoucherFull | null) => {
  if (!voucher) return 0
  const total = typeof voucher.total === 'number' ? voucher.total : parseMoney(String(voucher.total ?? ''))
  if (total) return total
  const amountValue =
    typeof voucher.amount === 'number'
      ? voucher.amount
      : parseMoney(String(voucher.amount ?? ''))
  return amountValue
}

const buildTitle = (voucher?: PettyCashVoucherFull | null, kind?: string | null) => {
  const voucherType = voucher?.voucher_type || kind || 'Vale'
  return `Aprobacion ${voucherType}`
}

const buildHistoryRows = (vouchers: PettyCashVoucherData[]): ValesHistoryRow[] =>
  vouchers.map((voucher) => {
    const amount = pickVoucherTotal(voucher)
    return {
      id: voucher.id,
      collaborator: voucher.employeename?.trim() || voucher.employee_id || '-',
      applicationDate: formatDateSafe(voucher.application_date),
      concept: voucher.concept || '-',
      voucherType: voucher.voucher_type || '-',
      voucherLabelType: voucherTypeToLabelType(voucher.voucher_type),
      amountLabel: formatCurrency(amount),
      status: voucher.status || 'Pendiente',
      statusLabelType: statusToLabelType(voucher.status),
    }
  })

const filterRows = (rows: ValesHistoryRow[], filterValue: string) => {
  const normalized = normalizeText(filterValue || 'all')
  if (!normalized || normalized === 'all') return rows

  return rows.filter((row) => {
    const typeValue = normalizeText(row.voucherType)
    const statusValue = normalizeText(row.status)

    if (normalized.includes('rosa')) return typeValue.includes('rosa')
    if (normalized.includes('azul')) return typeValue.includes('azul')
    if (normalized.includes('aprob') || normalized.includes('valid')) {
      return statusValue.includes('aprob') || statusValue.includes('valid')
    }
    if (normalized.includes('rechaz')) return statusValue.includes('rechaz')
    if (normalized.includes('pend')) return statusValue.includes('pend')

    return true
  })
}

/**
 * Hook que gestiona el detalle de autorizaciones de vales de caja chica.
 */
const useValesAuthorization = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const authorizationId =
    searchParams.get('authorization_id') || searchParams.get('id') || undefined
  const voucherId =
    searchParams.get('event_id') ||
    searchParams.get('authorization_id') ||
    searchParams.get('id') ||
    undefined
  const kind = searchParams.get('kind')

  const isGatewayReady = useIntranetGatewayStore((state) => state.isReady)

  const [activeFilter, setActiveFilter] = useState('all')
  const attemptedDetailRef = useRef<string | null>(null)
  const attemptedHistoryRef = useRef(false)
  const errorShownRef = useRef<string | null>(null)
  const redirectedRef = useRef(false)
  const lastActionRef = useRef<'detail' | 'history' | null>(null)

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
    getAuthorizations,
    approveAuthorization,
    rejectAuthorization,
    updateAuthorizationAuthorizer,
  } = useAuthorizationsStore(
    (state) => ({
      authorizations: state.authorizations,
      getAuthorizations: state.getAuthorizations,
      approveAuthorization: state.approveAuthorization,
      rejectAuthorization: state.rejectAuthorization,
      updateAuthorizationAuthorizer: state.updateAuthorizationAuthorizer,
    }),
    shallow,
  )

  const {
    pettyCashVouchers,
    pettyCashVoucherFull,
    loading,
    error,
    fetchPettyCashVoucherById,
    fetchPettyCashVouchers,
    resetFlags,
  } = useBillingPettyCash(
    (state) => ({
      pettyCashVouchers: state.pettyCashVouchers,
      pettyCashVoucherFull: state.pettyCashVoucherFull,
      loading: state.loading,
      error: state.error,
      fetchPettyCashVoucherById: state.fetchPettyCashVoucherById,
      fetchPettyCashVouchers: state.fetchPettyCashVouchers,
      resetFlags: state.resetFlags,
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

  const authorizerId =
    authorization?.authorizer?.employee_id || authorization?.authorizer?.id || ''

  const authorizationStatus =
    (typeof authorization?.status === 'string'
      ? authorization?.status
      : authorization?.status?.name) ??
    pettyCashVoucherFull?.status ??
    'Pendiente'
  const normalizedStatus = normalizeText(authorizationStatus)
  const isPendingStatus = normalizedStatus.includes('pend')
  const isRejectedStatus = normalizedStatus.includes('rechaz')
  const authorizationComment = authorization?.comment ?? ''

  useEffect(() => {
    if (loading) {
      const message =
        lastActionRef.current === 'history'
          ? 'Cargando historial de vales...'
          : 'Cargando vale de caja chica...'
      showSpinner({ message })
      return
    }

    hideSpinner()
  }, [hideSpinner, loading, showSpinner])

  useEffect(() => {
    if (!error) return

    if (errorShownRef.current === error) return
    errorShownRef.current = error

    const lower = String(error).toLowerCase()
    const isNotFound = lower.includes('no encontrado') || lower.includes('not found')

    const isDetailError = lastActionRef.current === 'detail'
    const title = isDetailError
      ? 'No se pudo cargar el vale'
      : 'No se pudo cargar el historial de vales'

    showAlert({
      type: 'error',
      variant: 'filled',
      title,
      description: String(error),
      showPrimaryButton: true,
      primaryLabel: isNotFound && isDetailError ? 'Regresar' : 'Entendido',
      onPrimaryClick: () => {
        hideAlert()
        if (isNotFound && isDetailError) {
          const base = pathname.split('?')[0]
          const clean = base.endsWith('/') ? base.slice(0, -1) : base
          router.push(clean)
          redirectedRef.current = true
        }
      },
      showSecondaryButton: true,
      secondaryLabel: isNotFound && isDetailError ? 'Cerrar' : 'Reintentar',
      onSecondaryClick: () => {
        hideAlert()
        if (!isNotFound) {
          if (isDetailError && voucherId) fetchPettyCashVoucherById(voucherId, true)
          if (!isDetailError) fetchPettyCashVouchers(true)
        }
      },
    })

    resetFlags()
  }, [
    error,
    fetchPettyCashVoucherById,
    fetchPettyCashVouchers,
    hideAlert,
    pathname,
    resetFlags,
    router,
    showAlert,
    voucherId,
  ])

  useEffect(() => {
    if (!voucherId || !isGatewayReady || redirectedRef.current) return
    if (attemptedDetailRef.current === voucherId) return

    attemptedDetailRef.current = voucherId
    lastActionRef.current = 'detail'
    fetchPettyCashVoucherById(voucherId, true)
  }, [fetchPettyCashVoucherById, isGatewayReady, voucherId])

  useEffect(() => {
    if (!isGatewayReady || attemptedHistoryRef.current) return
    attemptedHistoryRef.current = true
    lastActionRef.current = 'history'
    fetchPettyCashVouchers(true)
  }, [fetchPettyCashVouchers, isGatewayReady])

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
        description: 'No se encontró el autorizador.',
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
        description: 'No se encontró el autorizador.',
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

        showAlert(
          success
            ? {
                type: 'success',
                variant: 'filled',
                title: 'Autorizacion aprobada',
                description: 'La autorizacion fue aprobada correctamente.',
                showPrimaryButton: false,
                showSecondaryButton: false,
                autoCloseMs: 1800,
                onClose: hideAlert,
              }
            : {
                type: 'error',
                variant: 'filled',
                title: 'No se pudo aprobar',
                description: 'Ocurrio un error al aprobar la autorizacion.',
                showPrimaryButton: true,
                primaryLabel: 'Entendido',
                onPrimaryClick: hideAlert,
              },
        )

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
      title: 'Acción cancelada',
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

    showAlert(
      success
        ? {
            type: 'success',
            variant: 'filled',
            title: 'Autorizacion rechazada',
            description: 'La autorizacion fue rechazada correctamente.',
            showPrimaryButton: false,
            showSecondaryButton: false,
            autoCloseMs: 1800,
            onClose: hideAlert,
          }
        : {
            type: 'error',
            variant: 'filled',
            title: 'No se pudo rechazar',
            description: 'Ocurrio un error al rechazar la autorizacion.',
            showPrimaryButton: true,
            primaryLabel: 'Entendido',
            onPrimaryClick: hideAlert,
          },
    )

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

  const rows = useMemo(
    () => buildHistoryRows(pettyCashVouchers ?? []),
    [pettyCashVouchers],
  )

  const filteredRows = useMemo(() => filterRows(rows, activeFilter), [rows, activeFilter])

  const columns: ColumnDefinition<ValesHistoryRow>[] = useMemo(
    () => [
      { key: 'collaborator', label: 'COLABORADOR' },
      { key: 'applicationDate', label: 'FECHA' },
      { key: 'concept', label: 'CONCEPTO' },
      {
        key: 'voucherType',
        label: 'TIPO DE VALE',
        render: (row) => <Label type={row.voucherLabelType} text={row.voucherType} />,
      },
      {
        key: 'amountLabel',
        label: 'MONTO',
        render: (row) => row.amountLabel,
        cellClass: 'text-right',
        headerClass: 'text-right',
      },
      {
        key: 'status',
        label: 'ESTATUS',
        render: (row) => <Label type={row.statusLabelType} text={row.status} />,
      },
    ],
    [],
  )

  const totalAmount = pickVoucherTotal(pettyCashVoucherFull)
  const title = buildTitle(pettyCashVoucherFull ?? null, kind)

  return {
    authorizationId,
    authorization,
    authorizerId,
    voucherId,
    kind,
    title,
    voucher: pettyCashVoucherFull,
    rows: filteredRows,
    columns,
    activeFilter,
    setActiveFilter,
    statusLabelType: statusToLabelType(authorizationStatus),
    voucherLabelType: voucherTypeToLabelType(pettyCashVoucherFull?.voucher_type ?? kind ?? ''),
    formattedAmount: formatCurrency(totalAmount),
    formattedSubtotal: formatCurrency(pettyCashVoucherFull?.subtotal ?? 0),
    formattedIva: formatCurrency(pettyCashVoucherFull?.iva ?? 0),
    formattedTotal: formatCurrency(totalAmount || pettyCashVoucherFull?.total || 0),
    formattedDate: formatDateSafe(pettyCashVoucherFull?.application_date),
    projectCode: pettyCashVoucherFull?.project?.proyectkey ?? '-',
    collaborator: pettyCashVoucherFull?.employeename ?? '-',
    voucherUuid: pettyCashVoucherFull?.uuid ?? '-',
    rfcEmisor: pettyCashVoucherFull?.rfc_emisor ?? '-',
    rfcReceptor: pettyCashVoucherFull?.rfc_receptor ?? '-',
    concept: pettyCashVoucherFull?.concept ?? '-',
    authorizationStatus,
    isPendingStatus,
    isRejectedStatus,
    authorizationComment,
    attachments: {
      evidence: pettyCashVoucherFull?.authorization_evidence,
      xml: pettyCashVoucherFull?.xml,
      pdf: pettyCashVoucherFull?.pdf,
    },
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
  }
}

export default useValesAuthorization


