import React from 'react'
import { TableHeaderProps } from './types'
import { Checkbox } from '@/app/components/CheckBox/CheckBox'
import { DataTableHeaderStyles } from './styles'
import UpNavigation from '@/assets/icons/navegacion/nav-arrow-up.svg'
import DownNavigation from '@/assets/icons/navegacion/nav-arrow-down.svg'
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

        let arrow = null
        if (isActiveSort) {
          arrow = sortDirection === 'asc' ? <UpNavigation /> : <DownNavigation />
        }
        if (col.invisible) return null

        return (
          <button
            key={String(col.key)}
            type="button"
            onClick={() => onSort(col.key)}
            className={`b3 text-left cursor-pointer select-none bg-transparent border-none focus:outline-none ${col.headerClass ?? 'flex-1'}`}
          >
            <span className="inline-flex items-center gap-1">
              {col.headerRender ? col.headerRender() : col.label?.toUpperCase()}
              {arrow && <span className="flex-shrink-0">{arrow}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
