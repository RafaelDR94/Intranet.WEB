// src/app/.../RequisitionsList.tsx
'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { DataTable } from '@/app/components/DataTable/DataTable'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import { Button } from '@/app/components/Button/Button'
import { ContextMenu } from '@/app/components/ContextMenu/ContextMenu'
import DotsIcon from '@/assets/icons/navegacion/more-horiz.svg'
import { usePrincipal } from '@/app/context/PrincipalContext/PrincipalContext'
import { useRequisitionsStore } from '@/app/stores/useRequisitionStore/useRequisitionStore'
import { useIntranetGatewayStore } from '@/app/stores/system/useIntranetGatewayStore'

type RequisitionRow = {
  id: string
  snCode: string
  debtorName: string
  projectCode: string
}

const ActionMenuCell: React.FC<{
  row: RequisitionRow
  onEdit: (row: RequisitionRow) => void
  onDelete: (row: RequisitionRow) => void
}> = ({ row, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false)
  return (
    <ContextMenu
      isOpen={open}
      setIsOpen={setOpen}
      trigger={<Button size="xsmall" variant="ghost" icon={DotsIcon} />}
      items={[
        { label: 'Editar', onClick: () => { onEdit(row); setOpen(false) } },
        { label: 'Eliminar', danger: true, onClick: () => { onDelete(row); setOpen(false) } },
      ]}
    />
  )
}

const RequisitionsList: React.FC = () => {
  const { usePrincipalLoading, usePrincipalAlert } = usePrincipal()
  const { showSpinner, hideSpinner } = usePrincipalLoading
  const { showAlert, hideAlert } = usePrincipalAlert

  // Espera a que el gateway esté listo antes de prefetch
  const isGatewayReady = useIntranetGatewayStore(s => s.isReady)

  // Store directo (un solo selector + shallow)
  const {
    requisitions,
    loading,
    error,
    removing,
    fetchRequisitions,
    deleteRequisition,
  } = useRequisitionsStore(s => ({
    requisitions: s.requisitions,
    loading: s.loading,
    error: s.error,
    removing: s.removing,
    fetchRequisitions: s.fetchRequisitions,
    deleteRequisition: s.deleteRequisition,
  }), shallow)

  // Prefetch cuando el gateway esté listo
  useEffect(() => {
    if (isGatewayReady) void fetchRequisitions(true)
  }, [isGatewayReady, fetchRequisitions])

  // Spinner de carga (listar)
  useEffect(() => {
    if (loading) showSpinner({ message: 'Cargando requisiciones…' })
    else hideSpinner()
  }, [loading, showSpinner, hideSpinner])

  // Alert de error general
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

  const rows: RequisitionRow[] = useMemo(() => {
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
    // Abre modal/panel y usa updateRequisition del store
    console.log('Editar requisición:', row.id)
  }

  const onDelete = (row: RequisitionRow) => {
    showAlert({
      type: 'warning',
      variant: 'filled',
      title: 'Eliminar requisición',
      description: `¿Seguro que deseas eliminar ${row.snCode}?`,
      showPrimaryButton: true,
      primaryLabel: removing ? 'Eliminando…' : 'Eliminar',
      onPrimaryClick: async () => {
        hideAlert()
        showSpinner({ message: 'Eliminando…' })
        const ok = await deleteRequisition(row.id)
        hideSpinner()
        if (ok) {
          showAlert({
            type: 'success',
            variant: 'filled',
            title: 'Requisición eliminada',
            description: `${row.snCode} fue eliminada correctamente.`,
            showPrimaryButton: true,
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
          })
        }
      },
      showSecondaryButton: true,
      secondaryLabel: 'Cancelar',
      onSecondaryClick: hideAlert,
    })
  }

  const columns: ColumnDefinition<RequisitionRow>[] = useMemo(() => [
    { key: 'snCode', label: 'CÓDIGO SN' },
    { key: 'debtorName', label: 'NOMBRE DEUDOR' },
    { key: 'projectCode', label: 'CÓDIGO DE PROYECTO' },
    {
      key: 'actions' as unknown as keyof RequisitionRow,
      label: '',
      render: (row) => (
        <div className="flex justify-end pr-2">
          <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
      cellClass: 'w-12 text-right',
      headerClass: 'w-12',
    },
  ], [])

  return (
    <div className="space-y-8 overflow-auto">
      <DataTable
        onSearchChange={setQuery}
        onCalendarClick={() => fetchRequisitions(true)}
        onFilterClick={() => fetchRequisitions(true)}
        onSearch={() => console.log('Descargar requisiciones')}
        actionLabel="Descargar"
        tables={[{
          data: rows,
          columns,
          enableSelection: true,
          title: 'Listado Requisiciones',
          enableCollaps: true,
          defaultSortKey: 'debtorName',
          defaultSortDirection: 'asc',
          // si tu DataTable soporta:
          // loading,
          // emptyState: { title: 'Sin requisiciones', description: 'Crea una nueva para verla aquí.' },
        }]}
      />
    </div>
  )
}

export default RequisitionsList
