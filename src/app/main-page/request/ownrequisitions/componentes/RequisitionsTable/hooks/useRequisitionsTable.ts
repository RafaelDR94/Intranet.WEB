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
    const base = requisitions.map((r) => {
      const start = r?.assignmentdate?.split('T')?.[0];
      const end = (r as any)?.enddate ?? (r as any)?.endDate;
      const period = r?.period ?? (start && end ? `${start} - ${String(end).split('T')?.[0] ?? end}` : undefined);

      return {
        id: r?.billingrequisition_id ?? '',
        snCode: r?.requisitionkey ?? '',
        requisitionkey: r?.requisitionkey ?? '',
        debtorName: r?.employeename ?? '',
        employeeName: r?.employeename ?? '',
        // Prefer project ID/code to match visual sample
        projectCode: r?.projectname ?? '',
        projectname: r?.projectname ?? '',
        assignmentDate: r?.assignmentdate,
        dueDate: end,
        amount: Number(r?.amountdeposited ?? r?.provenamount ?? 0),
        status: r?.status,
        state: r?.state,
        date_created: r?.date_created,
        period,
        current_days: r?.current_days,
        phone_number: (r as any)?.phone_number ?? '',
        email: (r as any)?.email ?? '',
      };
    });

    if (!query) return base;

    const q = query.toLowerCase();
    return base.filter((r) =>
      [
        r.requisitionkey,
        r.debtorName,
        r.projectname,
        r.state,
        r.status,
        r.period,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q)),
    );
  }, [requisitions, query])

  const isActiveRequisition = (row: RequisitionRow) => {
    const normalized = `${row.status ?? ''} ${row.state ?? ''}`.toLowerCase()
    if (!normalized.trim()) return false

    const inactiveKeywords = ['cancelada', 'cierre', 'cerrada']
    if (inactiveKeywords.some(keyword => normalized.includes(keyword))) return false

    return normalized.includes('activa') || normalized.includes('activo') || normalized.includes('viatic') || normalized.includes('validaci') || normalized.includes('no iniciada')
  }

  const activeRows = useMemo(
    () => rows.filter(isActiveRequisition),
    [rows]
  )


  const openDetails = (row: RequisitionRow) => {
    const clean = path.endsWith('/') ? path.slice(0, -1) : path; // quita slash final si viene
    const qs = new URLSearchParams(searchParams.toString()); // clona params actuales
    const label = row.debtorName?.trim();

    qs.set('id', row.id); // añade/reemplaza id
    qs.set('label', label ? `Detalle Requisición` : 'Detalle'); // fuerza tab de detalle

    router.push(`${clean}?${qs.toString()}`);
  };

  const onEdit = openDetails;
  const handleOpenDetails = openDetails;

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
    rows, activeRows, query, setQuery,
    columns,
    // borrar
    confirmOpen, setConfirmOpen, rowToDelete, removing, handleConfirmDelete,
    // acciones
    onEdit, handleOpenDetails, onDelete, refresh,
    hasIdParam
  }
}
