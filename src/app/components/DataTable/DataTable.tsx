'use client'

import React from 'react'
import { DataTableProps } from './types'
import DataTableLayout from './components/DataTableLayout/DataTableLayout'
import DataTableContent from './components/DataTableContent/DataTableContent'
import CollapsibleSection from '../CollapsibleSection/CollapsibleSection'
import useDataTable from './hooks/useDataTable'

/**
 * Renderiza una o varias tablas con búsqueda y acciones configurables
 */
export const DataTable = <T extends { id: string | number }>({
  onSearch,
  onSearchChange,
  onCalendarClick,
  onFilterClick,
  onTableActionClick,
  actionLabel = 'Agregar',
  showCalendar = true,
  showFilter = false,
  showButton = true,
  actionsRender,
  tables,
  enableInternalSearch = true,
  searchableKeys,
  enablePagination = true,
  rowsPerPage = 10,
  onPageChange,
  dateKey,
}: DataTableProps<T>) => {

  const {
    handleSearchChange,
    handleDateChange,
    getFilteredData,
  } = useDataTable<T>({
    onSearchChange,
    enableInternalSearch,
    searchableKeys,
    dateKey
  })

  return (
    <div className="space-y-8">
      {tables.length > 1 && (
        <DataTableLayout
          onSearchChange={handleSearchChange}
          onCalendarClick={onCalendarClick}
          onFilterClick={onFilterClick}
          onDateRangeChange={(s?: Date | null, e?: Date | null) => {
            handleDateChange(s ?? null, e ?? null);
          }}
          onSearch={onSearch}
          actionLabel={actionLabel}
          showCalendar={showCalendar}
          showFilter={showFilter}
          showButton={showButton}
          actionsRender={actionsRender}
          onTableActionClick={onTableActionClick}
        />
      )}


      {tables.map((table, index) => {
        const filteredData = getFilteredData(table)
        return (
          <CollapsibleSection
            key={index + "table"}
            title={table?.title}
            enableCollapse={table.enableCollaps}
          >

            {tables.length === 1 && (
              <DataTableLayout
                onSearchChange={handleSearchChange}
                onCalendarClick={onCalendarClick}
                onFilterClick={onFilterClick}
                onDateRangeChange={(s?: Date | null, e?: Date | null) => {
                  handleDateChange(s ?? null, e ?? null); // normaliza undefined -> null
                }}
                onSearch={onSearch}
                actionLabel={actionLabel}
                showCalendar={showCalendar}
                showFilter={showFilter}
                showButton={showButton}
                actionsRender={actionsRender}
                onTableActionClick={onTableActionClick}
              />
            )}
            <DataTableContent
              data={filteredData}
              columns={table.columns}
              enableSelection={table.enableSelection}
              defaultSortDirection={table?.defaultSortDirection}
              defaultSortKey={table.defaultSortKey}
              enablePagination={enablePagination}
              rowsPerPage={rowsPerPage}
              totalRows={table.totalRows}
              enableInternalSearch={enableInternalSearch}
              onPageChange={onPageChange}
            />
          </CollapsibleSection>
        )
      })}
    </div>
  )
}
