import React from 'react'
import { TableHeaderProps } from './types'
import { Checkbox } from '@/app/components/CheckBox/CheckBox'
import { DataTableHeaderStyles } from './styles'

export const DataTableHeader = <T,>({
  columns,
  enableSelection,
  allSelected,
  onSelectAll,
  sortKey,
  sortDirection,
  onSort,
}: TableHeaderProps<T>) => {


  return (
    <div className={DataTableHeaderStyles.containerHeader}>
      {enableSelection && (
        <div className={DataTableHeaderStyles.checkboxContainer}>
          <Checkbox checked={allSelected} onChange={onSelectAll} />
        </div>
      )}

      {columns.map((col) => {
        const isActiveSort = sortKey === col.key

        let arrow = ''
        if (isActiveSort) {
          arrow = sortDirection === 'asc' ? '▲' : '▼'
        }

        return (
          <button
            key={String(col.key)}
            type="button"
            onClick={() => onSort(col.key)}
            className={`b3 text-left cursor-pointer select-none bg-transparent border-none focus:outline-none ${col.headerClass ?? 'flex-1'}`}
          >
            {col.headerRender ? col.headerRender() : col.label?.toUpperCase()} {arrow}
          </button>
        )
      })}
    </div>
  )
}
