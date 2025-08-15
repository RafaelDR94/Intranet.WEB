'use client'
import { useState,useMemo,useEffect } from 'react'
import { shallow } from 'zustand/shallow'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import type { RequisitionRow } from '../types'
import { RequisitionInitialValues } from '../../../../components/RequisitionsForm/hooks/useRequisitionsForm'
import { currentDate } from '@/app/utilities/DatesHelper/Dateshelper'

/** Parameters for the requisitions table hook. */
type Params = {
  /** Callback to open the editor with initial values. */
  onEditRequest: (initial: RequisitionInitialValues) => void
}

/**
 * Handles data loading, filtering and row actions for the requisitions table.
 * @param onEditRequest requests the parent to open the edit form.
 */
export const useRequisitionTable = ({ onEditRequest }: Params) => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  const isGatewayReady = useIntranetGatewayStore(s => s.isReady)

  const {
    requisitions, loading, error, removing, fetchRequisitions,fetchRequisitionsByDate, deleteRequisition,
  } = useRequisitionsStore(s => ({
    requisitions: s.requisitions,
    loading: s.loading,
    error: s.error,
    removing: s.removing,
    fetchRequisitions: s.fetchRequisitions,
    fetchRequisitionsByDate: s.fetchRequisitionsByDate,
    deleteRequisition: s.deleteRequisition,
  }), shallow)

  // Prefetch
  useEffect(() => {
    if (isGatewayReady) void fetchRequisitionsByDate(currentDate(),currentDate(),true);
  }, [isGatewayReady])

  // Spinner (listar)
  useEffect(() => {
    if (loading) showSpinner({ message: 'Cargando requisiciones…' })
    else hideSpinner()
  }, [loading, showSpinner, hideSpinner])

  // Alert de error general de carga
  useEffect(() => {
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

  const [query, setQuery] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<RequisitionRow | null>(null)

  const rows: RequisitionRow[] = useMemo(() => {
    const base = requisitions.map(r => ({
      id: r.billingrequisition_id,
      snCode: r.requisitionkey,
      debtorName: r.employeename,
      projectCode: r.projectname,
      date_created: r.date_created,
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
    console.log(row,"row");
    const full = requisitions.find(r => r.billingrequisition_id === row.id)
    if (!full) return
    const initial: RequisitionInitialValues = {
      id: full.billingrequisition_id,
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

  const refresh = (start?: Date, end?: Date ) =>{
    let startDate = start ? currentDate(start) : currentDate();
    let endDate = end ? currentDate(end) : currentDate();
    console.log(startDate,endDate); 
    fetchRequisitionsByDate(startDate, endDate, true);
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
  }
}
