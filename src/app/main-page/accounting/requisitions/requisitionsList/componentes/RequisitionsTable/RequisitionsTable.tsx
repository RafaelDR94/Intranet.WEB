'use client'
import React from 'react'
import { DataTable } from '@/app/components/DataTable/DataTable'
import { PopUp } from '@/app/components/PopUp/PopUp'
import type { ColumnDefinition } from '@/app/components/DataTable/types'
import { Button } from '@/app/components/Button/Button'
import { ContextMenu } from '@/app/components/ContextMenu/ContextMenu'
import DotsIcon from '@/assets/icons/navegacion/more-horiz.svg'
import { useRequisitionTable } from './hooks/useRequisitionsTable'
import { RequisitionsTableProps,ActionMenuCellProps,RequisitionRow } from './types'
import EditIcon from '@/assets/icons/Editor/edit-pencil.svg'
import DeleteIcon from '@/assets/icons/acciones/trash.svg'
import { container ,actionCell} from './styles'
const ActionMenuCell: React.FC<ActionMenuCellProps> = ({ row, onEdit, onDelete }) => {

  return (
    <ContextMenu
      alignRight
      autoFlip
      trigger={<Button size="xsmall" variant="ghost" icon={DotsIcon} />}
      items={[
        { label: 'Editar', icon: EditIcon, onClick: () => { onEdit(row);} },
        { label: 'Eliminar', icon: DeleteIcon, danger: true, onClick: () => { onDelete(row); } },
      ]}
    />
  )
}



const RequisitionsTable: React.FC<RequisitionsTableProps> = ({ onEditRequest }) => {
  const {
    rows,
    setQuery,
    confirmOpen,
    rowToDelete,
    removing,
    handleConfirmDelete,
    setConfirmOpen,
    onEdit,
    onDelete,
    refresh,
  } = useRequisitionTable({ onEditRequest })

  // Inyecta la celda de acciones una vez que existen callbacks
  const computedColumns: ColumnDefinition<RequisitionRow>[] = React.useMemo(() => {
    return [
      { key: 'snCode', label: 'CÓDIGO SN' },
      { key: 'debtorName', label: 'NOMBRE DEUDOR' },
      { key: 'projectCode', label: 'CÓDIGO DE PROYECTO' },
      { key: 'date_created', label: 'FECHA DE CREACIÓN' },
      
      {
        key: 'actions' as unknown as keyof RequisitionRow,
        label: '',
        render: (row) => (
          <div className={actionCell}>
            <ActionMenuCell row={row} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ),
        cellClass: 'w-12 text-right',
        headerClass: 'w-12',
        invisible:false
      },
    ]
  }, [onEdit, onDelete])

  return (
    <div className={container}>
      <PopUp
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="¿Deseas eliminar el documento seleccionado?"
        content={
          rowToDelete
            ? `Esta acción confirmará la eliminación de ${rowToDelete.snCode}.`
            : 'Esta acción confirmará la eliminación.'
        }
        showSecondaryButton
        secondaryButtonText="Cancelar"
        onSecondaryButtonClick={() => setConfirmOpen(false)}
        showPrimaryButton
        primaryButtonText={removing ? 'Eliminando…' : 'Eliminar'}
        onPrimaryButtonClick={handleConfirmDelete}

      />

      <DataTable
        dataTableTitle='Listado de Requisiciones'
        onSearchChange={setQuery}
        onCalendarClick={(start, end) => refresh(start, end)}
        onFilterClick={refresh}
        tables={[{
          data: rows,
          columns: computedColumns,
          enableSelection: true,
          title: 'Listado Requisiciones',
          enableCollaps: true,
          defaultSortKey: 'date_created',
          defaultSortDirection: 'desc',
        }]}
        showDownloadTable
        showButton={false}
        dateKey={"date_created"}
        
      />
    </div>
  )
}

export default RequisitionsTable
