import React from 'react'

import { useIsMobile } from '../../../DataTableLayout/hooks/useMediaQuery'

import { DataTableHeaderStyles } from './styles'
import { TableHeaderProps } from './types'

import { Checkbox } from '@/app/components/CheckBox/CheckBox'
import DownNavigation from '@/assets/icons/navegacion/nav-arrow-down.svg'
import UpNavigation from '@/assets/icons/navegacion/nav-arrow-up.svg'


export const DataTableHeader = <T,>({
  columns,
  enableSelection,
  allSelected,
  onSelectAll,
  sortKey,
  sortDirection,
  onSort,
  disableSelection,
  selectionMode
}: TableHeaderProps<T>) => {

  const isMobile = useIsMobile()

  return (
    <div className={DataTableHeaderStyles.containerHeader}>
      {enableSelection && (
        <div className={DataTableHeaderStyles.checkboxContainer}>
          <Checkbox
            checked={allSelected}
            disabled={disableSelection || selectionMode === "single"}
            onChange={(val) => { if (disableSelection || selectionMode === "single") return; else onSelectAll(val) }}
          />
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
            className={
              isMobile
                ? `${DataTableHeaderStyles.headerTextMobile} min-w-0 ${col.headerClass ?? 'flex-1'}`
                : `${DataTableHeaderStyles.headerTextDesk} min-w-0 ${col.headerClass ?? 'flex-1'}`
            }
          >
            <span className="inline-flex min-w-0 items-center gap-1">
              <span className="truncate">
                {col.headerRender ? col.headerRender() : col.label?.toUpperCase()}
              </span>
              {arrow && <span className="flex-shrink-0">{arrow}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
