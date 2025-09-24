import React from 'react'

import { useIsMobile } from '../../../DataTableLayout/hooks/useMediaQuery'

import { Checkbox } from '@/app/components/CheckBox/CheckBox'

export type TextSize = {
  /** clases para móvil: ej. 'c3' o 'text-sm' */
  mobile?: string
  /** clases para desktop: ej. 'b2' o 'text-base' */
  desktop?: string
}

export type Column<T> = {
  key: keyof T
  invisible?: boolean
  cellClass?: string
  render?: (row: T) => React.ReactNode
}

export type DataTableBodyProps<T extends { id: string | number }> = {
  data: T[]
  columns: Array<Column<T>>
  enableSelection?: boolean
  selected: T[]
  onToggleSelect: (row: T) => void
  /** Nuevo: controla tamaños de texto por breakpoint */
  textSize?: TextSize
}

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(' ')

export const DataTableBodyStyles = {
  bodyContainer:
    'flex items-center px-4 py-1 rounded-md hover:bg-gray-10 transition-colors',
  checkBoxContainer: 'w-6 mr-4',
  // ahora como funciones con default
  tableTextMobile: (size = 'c3') => cx(size, 'text-gray-70', 'font-medium'),
  tableTextDesk: (size = 'b2') => cx(size, 'text-gray-70', 'font-medium'),
}

export const DataTableBody = <T extends { id: string | number }>({
  data,
  columns,
  enableSelection,
  selected,
  onToggleSelect,
  textSize,
}: DataTableBodyProps<T>) => {
  const isMobile = useIsMobile()

  const mobileText = DataTableBodyStyles.tableTextMobile(textSize?.mobile)
  const deskText = DataTableBodyStyles.tableTextDesk(textSize?.desktop)

  return (
    <>
      {data.map((row, index) => {
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
                  className={cx(isMobile ? mobileText : deskText, col.cellClass ?? 'flex-1')}
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
