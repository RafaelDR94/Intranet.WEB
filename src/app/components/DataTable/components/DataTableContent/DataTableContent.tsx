import React from 'react'
import { DataTableContentProps } from './types'
import { DataTableHeader } from './components/DataTableHeader/DataTableHeader'
import { DataTableBody } from './components/DataTableBody/DataTableBody'
import { useTableContent } from './hooks/useTableContent'
import { containerDataTableContent } from './styles'


const DataTableContent = <T extends { id: string | number }>({
  data,
  columns,
  enableSelection = false,
  defaultSortKey,
  defaultSortDirection,
}: DataTableContentProps<T>) => {
  const {
    selected,
    allSelected,
    toggleSelect,
    selectAll,
    sortKey,
    sortDirection,
    handleSort,
    sortedData,
  } = useTableContent<T>({
    data,
    defaultSortKey,
    defaultSortDirection,
  })

  return (
    <div className={containerDataTableContent}>
      <DataTableHeader
        columns={columns}
        enableSelection={enableSelection}
        allSelected={allSelected}
        onSelectAll={selectAll}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
      <DataTableBody
        data={sortedData}
        columns={columns}
        enableSelection={enableSelection}
        selected={selected}
        onToggleSelect={toggleSelect}
      />
    </div>
  )
}

export default DataTableContent
