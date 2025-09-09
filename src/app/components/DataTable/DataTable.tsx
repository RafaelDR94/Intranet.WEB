'use client'

import React from 'react'

import CollapsibleSection from '../CollapsibleSection/CollapsibleSection'

import DataTableContent from './components/DataTableContent/DataTableContent'
import DataTableLayout from './components/DataTableLayout/DataTableLayout'
import useDataTable from './hooks/useDataTable'
import { DataTableProps } from './types'

/**
 * `DataTable` – Renderiza una o varias tablas con:
 * - Cabecera de acciones (buscar, calendario, filtros, botón principal)
 * - Búsqueda interna/externa
 * - Filtro por rango de fechas
 * - Paginación
 * - Selección de filas y descarga (opcional)
 *
 * @template T Debe incluir `{ id: string | number }`.
 *
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
  showDownloadTable = false,
  actionsRender,
  tables,
  enableInternalSearch = true,
  searchableKeys,
  enablePagination = true,
  rowsPerPage = 10,
  onPageChange,
  dateKey,
  onSelectedChange,
  dataTableTitle,
  startCollpas=false


}: DataTableProps<T>) => {

  const {
    handleSearchChange,
    handleDateChange,
    getFilteredData,
    handleSelectedChange,
    handleDownload,
    selectedRows
  } = useDataTable<T>({
    onSelectedChange,
    onSearchChange,
    enableInternalSearch,
    searchableKeys,
    dateKey,
    
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
          showDownloadTable={showDownloadTable}
          downloadDisabled={!Object.values(selectedRows).some((r) => r?.length)}
          onDownload={(kind) => handleDownload(kind,tables,dataTableTitle)}
        />
      )}


      {tables.map((table, index) => {
        const filteredData = getFilteredData(table)
        return (
          <CollapsibleSection
            key={index + "table"}
            title={table?.title}
            enableCollapse={table.enableCollaps}
            defaultOpen={!startCollpas}
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
                showDownloadTable={showDownloadTable}
                actionsRender={actionsRender}
                onTableActionClick={onTableActionClick}
                downloadDisabled={!(selectedRows[index]?.length)}
                onDownload={(kind) => handleDownload(kind,tables,dataTableTitle,index)}
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
              onSelectedChange={(rows) => handleSelectedChange(index, rows)}
              scrollMaxHeight={table.scrollMaxHeight}
              showButton={showButton}
              actionsRender={actionsRender}
              onTableActionClick={onTableActionClick}
              actionLabel={actionLabel}
            />
          </CollapsibleSection>
        )
      })}
    </div>
  )
}
