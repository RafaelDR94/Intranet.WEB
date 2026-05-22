"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { shallow } from 'zustand/shallow'
import { useIsMobile } from '@/app/components/DataTable/components/DataTableLayout/hooks/useMediaQuery'
import { Button } from '@/app/components/Button/Button'
import Label from '@/app/components/Label/Label'
import type { LabelType } from '@/app/components/Label/types'
import type { ColumnDefinition, DataTableFilterOption } from '@/app/components/DataTable/types'
import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import type { Authorization } from '@/app/mappings/authorizations/authorizations.types'
import { useAuthorizationsStore } from '@/app/stores/useAuthorizationsStore/useAuthorizationsStore'

import type { AuthorizationListRow } from '../types'

const formatDisplayDate = (value?: string): string => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-MX')
}

const statusToLabelType = (status?: string): LabelType => {
  const normalized = (status ?? '').toLowerCase()
  if (normalized.includes('aprob')) return 'valido'
  if (normalized.includes('rechaz')) return 'rechazado'
  if (normalized.includes('cancel')) return 'restringido'
  if (normalized.includes('pend')) return 'pendiente'
  return 'actualizado'
}

const getApplicantName = (authorization: Authorization): string =>
  authorization.applicant?.fullname ||
  [
    authorization.applicant?.firstname,
    authorization.applicant?.secondname,
    authorization.applicant?.lastname,
    authorization.applicant?.motherlast_name,
  ]
    .filter((part) => part && String(part).trim() !== '')
    .join(' ')

/**
 * Hook que prepara columnas, filtros y data para el listado de autorizaciones.
 */
const useAuthorizationsList = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const { usePrincipalAlert, usePrincipalLoading } = usePrincipal()
  const { showAlert, hideAlert } = usePrincipalAlert
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const isMobile = useIsMobile();

  const {
    authorizations,
    loading,
    error,
    getAuthorizationsByIdAuthorizer,
    resetFlags,
  } = useAuthorizationsStore(
    (state) => ({
      authorizations: state.authorizations,
      loading: state.loading,
      error: state.error,
      getAuthorizationsByIdAuthorizer: state.getAuthorizationsByIdAuthorizer,
      resetFlags: state.resetFlags,
    }),
    shallow,
  )

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const authorizerId = user?.idEmployee ?? ''

  const handleRefresh = useCallback(() => {
    if (!authorizerId) return
    getAuthorizationsByIdAuthorizer(authorizerId, true)
  }, [authorizerId, getAuthorizationsByIdAuthorizer])

  useEffect(() => {
    if (!authorizerId) return
    getAuthorizationsByIdAuthorizer(authorizerId, true)
  }, [authorizerId, getAuthorizationsByIdAuthorizer])

  useEffect(() => {
    if (loading) {
      showSpinner({ message: 'Cargando autorizaciones...' })
      return
    }

    hideSpinner()

    if (error) {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudieron cargar las autorizaciones',
        description: String(error),
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
        showSecondaryButton: true,
        secondaryLabel: 'Reintentar',
        onSecondaryClick: () => {
          hideAlert()
          if (authorizerId) {
            getAuthorizationsByIdAuthorizer(authorizerId, true)
          }
        },
      })
      resetFlags()
    }
  }, [
    authorizerId,
    error,
    getAuthorizationsByIdAuthorizer,
    hideAlert,
    hideSpinner,
    loading,
    resetFlags,
    showAlert,
    showSpinner,
  ])

  const rows: AuthorizationListRow[] = useMemo(() => {
    const mapped = authorizations.map((authorization) => {
      const statusName =
        typeof authorization.status === 'string'
          ? authorization.status
          : authorization.status?.name

      return {
        id: authorization.authorization_id,
        eventId: authorization.event_id,
        enterprise: authorization.enterprise?.name ?? '-',
        department: authorization.department?.name ?? '-',
        applicant: getApplicantName(authorization) || '-',
        kind: authorization.kind?.name ?? '-',
        project: authorization.proyect?.proyectKey ?? '-',
        date: formatDisplayDate(authorization.dateCreated),
        status: statusName ?? '-',
        dateRaw: authorization.dateCreated,
      }
    })

    if (statusFilter === 'all') return mapped
    return mapped.filter((row) => row.status.toLowerCase() === statusFilter)
  }, [authorizations, statusFilter])

  const handleViewRequest = useCallback(
    (row: AuthorizationListRow) => {
      const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
      const label = `Solicitud de ${row.kind}`
      const qs = new URLSearchParams()
      qs.set('id', row.id)
      qs.set('authorization_id', row.id)
      if (row.eventId) qs.set('event_id', row.eventId)
      if (row.kind) qs.set('kind', row.kind)
      qs.set('label', label)

      router.push(`${clean}?${qs.toString()}`)
    },
    [pathname, router],
  )

  const desktopColumns: ColumnDefinition<AuthorizationListRow>[] = useMemo(
    () => [
      {
        key: 'enterprise', label: 'EMPRESA',
        cellClass: 'w-2/16 text-left',
        headerClass: 'w-2/16 text-left',
      },
      {
        key: 'department', label: 'DEPARTAMENTO',
        cellClass: 'w-3/16 text-left',
        headerClass: 'w-3/16 text-left',
      },
      {
        key: 'applicant', label: 'SOLICITANTE',
        cellClass: 'w-4/16 text-center',
        headerClass: 'w-4/16',
      },
      {
        key: 'kind', label: 'TIPO DE SOLICITUD',
        cellClass: 'w-2/16 text-left',
        headerClass: 'w-2/16 text-left',
      },
      {
        key: 'project', label: 'PROYECTO',
        cellClass: 'w-2/16 text-left',
        headerClass: 'w-2/16 text-left',
      },
      {
        key: 'date', label: 'FECHA',
        cellClass: 'w-1/16 text-left',
        headerClass: 'w-1/16 text-left',
      },
      {
        key: 'status',
        label: 'ESTATUS',
        render: (row) => <Label type={statusToLabelType(row.status)} text={row.status} />,
        cellClass: 'w-2/16 text-left',
        headerClass: 'w-2/16 text-left',
      },
      {
        key: 'id',
        label: '',
        render: (row) => (
          <Button
            hideIcon
            variant="ghost"
            size="small"
            onClick={() => handleViewRequest(row)}
            data-tour="authorizations-row-view"
          >
            Ver Solicitud
          </Button>
        ),
        cellClass: 'w-2/16 text-right pr-4',
        headerClass: 'w-2/16 text-right pr-4',
      },
    ],
    [handleViewRequest],
  )

  const mobileColumns: ColumnDefinition<AuthorizationListRow>[] = useMemo(
    () => [
      {
        key: 'applicant', label: 'SOLICITANTE',
        cellClass: 'w-4/16 text-center',
        headerClass: 'w-[30%]',
      },
      {
        key: 'project', label: 'PROYECTO',
        cellClass: 'w-2/16 text-left',
        headerClass: 'w-[25%]', 
      },
      {
        key: 'date', label: 'FECHA',
        cellClass: 'w-1/16 text-left',
        headerClass: 'w-[25%]',
      },
      {
        key: 'status',
        label: 'ESTATUS',
        render: (row) => <Label type={statusToLabelType(row.status)} text={row.status} />,
        cellClass: 'w-1/16 text-left',
        headerClass: 'w-[25%]',
      },
    ],
    [handleViewRequest],
  )

  const columns = isMobile ? mobileColumns : desktopColumns;

  const filterOptions: DataTableFilterOption<AuthorizationListRow>[] = useMemo(
    () => [
      { label: 'Todos', value: 'all' },
      { label: 'Pendiente', value: 'pendiente' },
      { label: 'Aprobada', value: 'aprobada' },
      { label: 'Rechazada', value: 'rechazada' },
      { label: 'Cancelada', value: 'cancelada' },
    ],
    [],
  )

  const handleFilterChange = useCallback((value: string) => {
    setStatusFilter(value)
  }, [])

  return {
    columns,
    rows,
    filterOptions,
    filterValue: statusFilter,
    handleFilterChange,
    handleRefresh,
  }
}

export default useAuthorizationsList
