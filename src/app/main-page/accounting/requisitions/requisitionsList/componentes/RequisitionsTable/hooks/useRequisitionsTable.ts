'use client'
import React from 'react'
import { shallow } from 'zustand/shallow'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import type { RequisitionRow } from '../types'
import { RequisitionInitialValues } from '../../../../components/RequisitionsForm/hooks/useRequisitionsForm'

type Params = {
  onEditRequest: (initial: RequisitionInitialValues) => void
}

export const useRequisitionTable = ({ onEditRequest }: Params) => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  const isGatewayReady = useIntranetGatewayStore(s => s.isReady)

  const {
    requisitions, loading, error, removing, fetchRequisitions, deleteRequisition,
  } = useRequisitionsStore(s => ({
    requisitions: s.requisitions,
    loading: s.loading,
    error: s.error,
    removing: s.removing,
    fetchRequisitions: s.fetchRequisitions,
    deleteRequisition: s.deleteRequisition,
  }), shallow)

  // Prefetch
  React.useEffect(() => {
    if (isGatewayReady) void fetchRequisitions(true)
  }, [isGatewayReady, fetchRequisitions])

  // Spinner (listar)
  React.useEffect(() => {
    if (loading) showSpinner({ message: 'Cargando requisiciones…' })
    else hideSpinner()
  }, [loading, showSpinner, hideSpinner])

  // Alert de error general de carga
  React.useEffect(() => {
    if (!error) return
    showAlert({
      type: 'error',
      variant: 'filled',
      title: 'No se pudieron cargar las requisiciones',
      description: String(error),
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: 'Reintentar',
      onSecondaryClick: () => { hideAlert(); fetchRequisitions(true) },
    })
  }, [error, showAlert, hideAlert, fetchRequisitions])

  const [query, setQuery] = React.useState('')
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [rowToDelete, setRowToDelete] = React.useState<RequisitionRow | null>(null)

  const rows: RequisitionRow[] = React.useMemo(() => {
    const base = requisitions.map(r => ({
      id: r.id_billingrequisition,
      snCode: r.requisitionkey,
      debtorName: r.employeename,
      projectCode: r.projectname,
    }))
    if (!query) return base
    const q = query.toLowerCase()
    return base.filter(r =>
      r.snCode.toLowerCase().includes(q) ||
      r.debtorName.toLowerCase().includes(q) ||
      r.projectCode.toLowerCase().includes(q)
    )
  }, [requisitions, query])

  const onEdit = (row: RequisitionRow) => {
    const full = requisitions.find(r => r.id_billingrequisition === row.id)
    if (!full) return
    const initial: RequisitionInitialValues = {
      id: full.id_billingrequisition,
      employeeId: full.id_Employee, // ajusta si difiere del store
      projectId: full.idProject,    // ajusta si difiere del store
      requisitionKey: full.requisitionkey,
    }
    onEditRequest(initial)
  }

  const onDelete = (row: RequisitionRow) => {
    setRowToDelete(row)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    const current = rowToDelete
    if (!current) return
    setConfirmOpen(false)

    showSpinner({ message: 'Espera un momento, el documento se está eliminando' })
    const ok = await deleteRequisition(current.id)
    hideSpinner()
    setRowToDelete(null)

    if (ok) {
      showAlert({
        type: 'success',
        variant: 'filled',
        title: 'Requisición eliminada',
        description: `${current.snCode} fue eliminada correctamente.`,
        showPrimaryButton: true,
        showSecondaryButton: false,
        primaryLabel: 'Cerrar',
        onPrimaryClick: hideAlert,
      })
    } else {
      showAlert({
        type: 'error',
        variant: 'filled',
        title: 'No se pudo eliminar',
        description: 'Intenta de nuevo en unos segundos.',
        showPrimaryButton: true,
        primaryLabel: 'Entendido',
        onPrimaryClick: hideAlert,
        showSecondaryButton: true,
        secondaryLabel: 'Reintentar',
        onSecondaryClick: () => { hideAlert(); onDelete(current) },
      })
    }
  }

  const refresh = () => fetchRequisitions(true)

  // columns estático si en algún punto deseas moverlo aquí (dejo ejemplo):
  const columns = [] as const

  return {
    // tabla
    rows, query, setQuery,
    columns,
    // borrar
    confirmOpen, setConfirmOpen, rowToDelete, removing, handleConfirmDelete,
    // acciones
    onEdit, onDelete, refresh,
  }
}
