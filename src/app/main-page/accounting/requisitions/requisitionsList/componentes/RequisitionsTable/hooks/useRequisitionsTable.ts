'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useMemo, useEffect } from 'react'
import { shallow } from 'zustand/shallow'

import type { RequisitionRow } from '../types'

import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'
import { useBillingRequisitionWithEmployeesStore } from '@/app/stores/useBillingRequisitionWithEmployeesStore/useBillingRequisitionWithEmployeesStore'
import { currentDate } from '@/app/utilities/DatesHelper/Dateshelper'

/**
 * Handles data loading, filtering and row actions for the requisitions table.
 */
export const useRequisitionTable = () => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert
  const [lastDates, setLastDates] = useState<{ startDate: string, endDate: string }>({ startDate: currentDate(), endDate: currentDate() })
  const isGatewayReady = useIntranetGatewayStore(s => s.isReady)
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasIdParam =
    typeof (searchParams as any)?.has === "function"
      ? (searchParams as any).has("id")
      : new URLSearchParams((searchParams as any) ?? "").has("id");
  const {
    requisitions,
    loading,
    error,
    removing,
    fetchRequisitionsWithEmployees,
    deleteRequisition,
    resetFlags,
  } = useBillingRequisitionWithEmployeesStore(
    (s) => ({
      requisitions: s.requisitions,
      loading: s.loading,
      error: s.error,
      removing: s.removing,
      fetchRequisitionsWithEmployees: s.fetchRequisitionsWithEmployees,
      deleteRequisition: s.deleteRequisition,
      resetFlags: s.resetFlags,
    }),
    shallow,
  )

  // Prefetch
  useEffect(() => {
    if (isGatewayReady && !hasIdParam)
      fetchRequisitionsWithEmployees(lastDates.startDate, lastDates.endDate, true)
  }, [isGatewayReady, hasIdParam, fetchRequisitionsWithEmployees, lastDates.startDate, lastDates.endDate])


  // Alert de error general de carga
  useEffect(() => {
    if (loading) { showSpinner({ message: 'Cargando requisiciones…' }); return; }
    hideSpinner();
    resetFlags();
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
      onSecondaryClick: () => {
        hideAlert();
        fetchRequisitionsWithEmployees(lastDates.startDate, lastDates.endDate, true);
      },
    })

  }, [
    error,
    loading,
    hideSpinner,
    resetFlags,
    showAlert,
    showSpinner,
    hideAlert,
    fetchRequisitionsWithEmployees,
    lastDates.startDate,
    lastDates.endDate,
  ])

  const [query, setQuery] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<RequisitionRow | null>(null)


  const rows: RequisitionRow[] = useMemo(() => {
    const base = requisitions.map(r => {
      const employeename = r?.employeename ?? ''

      return {
        id: r?.billingrequisition_id ?? '',
        employeeId: r?.id_Employee ?? '',
        snCode: r?.requisitionkey ?? '',
        employeename,
        debtorName: employeename,
        // Prefer project ID/code to match visual sample
        projectCode: r?.projectname ?? '',
        assignmentDate: r?.assignmentdate,
        dueDate: r?.endDate,
        amount: Number(r?.amountdeposited),
        status: r?.status,
        state: r?.state,
        phone_number: r?.phone_number ?? '',
        email: r?.email ?? '',
        date_created: r?.date_created,
      }
    })
    if (!query) return base
    const q = query.toLowerCase()
    return base.filter(r =>
      r.snCode.toLowerCase().includes(q) ||
      r.employeename?.toLowerCase().includes(q) ||
      r.debtorName.toLowerCase().includes(q) ||
      r.projectCode.toLowerCase().includes(q)
    )
  }, [requisitions, query])

  const onEdit = (row: RequisitionRow) => {
    const clean = path.endsWith('/') ? path.slice(0, -1) : path; // quita slash final si viene
    const qs = new URLSearchParams(searchParams.toString());     // clona params actuales
    qs.delete('label');                                          // remueve label previo de vistas de archivos/requisiciones
    qs.set('id', row.id);                                        // añade/reemplaza id
    router.push(`${clean}?${qs.toString()}`);
  };

  const getFirstName = (name?: string | null) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    return parts[0] || '';
  };

  const buildLabel = (prefix: string, name?: string | null) => {
    const firstName = getFirstName(name);
    return firstName ? `${prefix} ${firstName}` : prefix;
  };

  const onViewFiles = (row: RequisitionRow) => {
    const clean = path.endsWith('/') ? path.slice(0, -1) : path;
    const qs = new URLSearchParams(searchParams.toString());
    qs.set('id', row.id);
    qs.set('label', buildLabel('Archivos', row.debtorName));
    router.push(`${clean}?${qs.toString()}`);
  };

  const onViewRequisitions = (row: RequisitionRow) => {
    const clean = path.endsWith('/') ? path.slice(0, -1) : path;
    const qs = new URLSearchParams(searchParams.toString());
    const requisitionsLabel = buildLabel('Requisiciones', row.debtorName);
    qs.set('id', row.employeeId ?? row.id);
    qs.set('idEmployee', row.employeeId ?? row.id);
    qs.set('label', requisitionsLabel);
    qs.set('requisitionsLabel', requisitionsLabel);
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

  const refresh = (start?: Date, end?: Date) => {
    const startDate = start ? currentDate(start) : currentDate();
    const endDate = end ? currentDate(end) : currentDate();
    setLastDates({ startDate: startDate, endDate: endDate })
    fetchRequisitionsWithEmployees(startDate, endDate, true)
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
    onEdit, onViewFiles, onViewRequisitions, onDelete, refresh,
    hasIdParam
  }
}
