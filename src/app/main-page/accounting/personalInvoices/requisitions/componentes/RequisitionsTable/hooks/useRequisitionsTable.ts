'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useMemo, useEffect } from 'react'
import { shallow } from 'zustand/shallow'

import type { RequisitionRow } from '../types'

import { useAuth } from '@/app/context/AuthContext/AuthContext'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'

/**
 * Handles data loading, filtering and row actions for the requisitions table.
 */
export const useRequisitionTable = () => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert
  const { user } = useAuth()
  const isGatewayReady = useIntranetGatewayStore(s => s.isReady)
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasIdParam =
    typeof (searchParams as any)?.has === "function"
      ? (searchParams as any).has("id")
      : new URLSearchParams((searchParams as any) ?? "").has("id");
  const {
    requisitions, loading, error, warning, removing, successPut, fetchRequisitionsByIdEmployee, deleteRequisition, resetFlags
  } = useRequisitionsStore(s => ({
    requisitions: s.requisitions,
    loading: s.loading,
    error: s.error,
    warning: s.warning,
    removing: s.removing,
    successPut:s.successPut,
    fetchRequisitionsByIdEmployee: s.fetchRequisitionsByIdEmployee,
    deleteRequisition: s.deleteRequisition,
    resetFlags: s.resetFlags
  }), shallow)

  // Prefetch
  useEffect(() => {
    if (isGatewayReady && !hasIdParam && user?.idEmployee) {
      fetchRequisitionsByIdEmployee(user.idEmployee, true);
    }
  }, [isGatewayReady, hasIdParam, user?.idEmployee, fetchRequisitionsByIdEmployee])


  // Alert de error general de carga
  useEffect(() => {
    if (loading) { showSpinner({ message: 'Cargando requisiciones…' }); return; }
    hideSpinner();
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
      onSecondaryClick: () => { hideAlert(); if (user?.idEmployee) fetchRequisitionsByIdEmployee(user.idEmployee, true); },
    })
    resetFlags();

  }, [error, loading, successPut, hideSpinner, resetFlags, showAlert, showSpinner, hideAlert, fetchRequisitionsByIdEmployee, user?.idEmployee])

  useEffect(() => {
    if (!warning) return

    showAlert({
      type: 'warning',
      variant: 'filled',
      title: 'Sin requisiciones',
      description: warning,
      showPrimaryButton: true,
      primaryLabel: 'Entendido',
      onPrimaryClick: hideAlert,
      showSecondaryButton: true,
      secondaryLabel: 'Refrescar',
      onSecondaryClick: () => { hideAlert(); if (user?.idEmployee) fetchRequisitionsByIdEmployee(user.idEmployee, true); },
    })
    resetFlags();
  }, [warning, hideAlert, showAlert, user?.idEmployee, fetchRequisitionsByIdEmployee, resetFlags])

  const [query, setQuery] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<RequisitionRow | null>(null)


  const rows: RequisitionRow[] = useMemo(() => {
    const base = requisitions.map(r => ({
      id: r?.billingrequisition_id,
      snCode: r?.requisitionkey,
      debtorName: r?.employeename,
      // Prefer project ID/code to match visual sample
      projectCode: r?.projectname,
      assignmentDate: r?.assignmentdate,
      dueDate: r.endDate,
      amount: Number(r?.amountdeposited),
      status: r?.status,
      state:r?.state,
      date_created: r?.date_created,
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
    const clean = path.endsWith('/') ? path.slice(0, -1) : path; // quita slash final si viene
    const qs = new URLSearchParams(searchParams.toString());     // clona params actuales
    qs.set('id', row.id);                                        // añade/reemplaza id
    router.push(`${clean}?${qs.toString()}`);
  };

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
        type: 'warning',
        variant: 'filled',
        title: 'Requisición eliminada',
        description: `${current.snCode} fue eliminada correctamente.`,
        showPrimaryButton: false,
        showSecondaryButton: false,
        autoCloseMs: 1500,
        onClose: hideAlert,
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

  const refresh = (_start?: Date, _end?: Date) => {
    if (user?.idEmployee) fetchRequisitionsByIdEmployee(user.idEmployee, true);
  }

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
    hasIdParam
  }
}
