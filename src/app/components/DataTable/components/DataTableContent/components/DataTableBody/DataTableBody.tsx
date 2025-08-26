import React from 'react'
import { DataTableBodyProps } from './types'
import { Checkbox } from '@/app/components/CheckBox/CheckBox'
import { DataTableBodyStyles } from './styles'
import { useIsMobile } from '../../../DataTableLayout/hooks/useMediaQuery'

export const DataTableBody = <T extends { id: string | number }>({
  data,
  columns,
  enableSelection,
  selected,
  onToggleSelect,
}: DataTableBodyProps<T>) => {
  const isMobile = useIsMobile()
  return (
    <>
      {data.map((row,index) => {
        const isSelected = selected.includes(row)
        return (
          <div
            key={`${row.id}-${index}`}
            className={DataTableBodyStyles.bodyContainer}
          >
            {enableSelection && (
              <div className={DataTableBodyStyles.checkBoxContainer}>
                <Checkbox
                  checked={isSelected}
                  onChange={() => onToggleSelect(row)}
                />
              </div>
            )}
            {columns.map((col) => {
              if (col.invisible) return null
              return (
                <div
                  key={String(col.key)}
                  className={isMobile ? `${DataTableBodyStyles.tableTextMobile} ${col.cellClass ?? 'flex-1'}` : `${DataTableBodyStyles.tableTextDesk} ${col.cellClass ?? 'flex-1'}`}
                >
                  {col.render ? col.render(row) : String(row[col.key])}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
