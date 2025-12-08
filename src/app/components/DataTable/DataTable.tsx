'use client'

import React, { useEffect } from 'react'

import CollapsibleSection from '../CollapsibleSection/CollapsibleSection'

import CardsGrid from '../CardsGrid/CardsGrid'
import type { TextSize } from './components/DataTableContent/components/DataTableBody/DataTableBody'
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
 */
export const DataTable = <T extends { id: string | number }>({
  onSearch,
  onSearchChange,
  onCalendarClick,
  onFilterClick,
  filterOptions,
  filterValue,
  filterTitle,
  onFilterChange,
  onTableActionClick,
  actionLabel = 'Agregar',
  showCalendar = true,
  showFilter = false,
  showButton = true,
  showDownloadTable = false,
  showRefresh = false,
  onRefreshPage,
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
  startCollpas = false,
  useCardsView = false,
  showViewSwitcher = false,
  textSize, 
  rightContent,
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

  const [isCardsView, setIsCardsView] = React.useState(false)

  useEffect(() => {
    setIsCardsView(!!useCardsView)
  }, [useCardsView])

  const handleFilterSelect = React.useCallback(
    (value: string) => {
      if (!onFilterChange) return;
      const option = filterOptions?.find((item) => item.value === value);
      onFilterChange(value, option);
    },
    [filterOptions, onFilterChange]
  )

  return (
    <div className="space-y-8">
      {tables.length > 1 && (
        <DataTableLayout
          
          onSearchChange={handleSearchChange}
          onCalendarClick={onCalendarClick}
          onFilterClick={onFilterClick}
          onFilterChange={handleFilterSelect}
          onDateRangeChange={(s?: Date | null, e?: Date | null) => {
            handleDateChange(s ?? null, e ?? null)
          }}
          onSearch={onSearch}
          actionLabel={actionLabel}
          showCalendar={showCalendar}
          showFilter={showFilter}
          filterOptions={filterOptions}
          filterValue={filterValue ?? undefined}
          filterTitle={filterTitle}
          showButton={showButton}
          showRefresh={showRefresh}
          onRefreshPage={onRefreshPage}
          actionsRender={actionsRender}
          onTableActionClick={onTableActionClick}
          showDownloadTable={showDownloadTable}
          downloadDisabled={!Object.values(selectedRows).some((r) => r?.length)}
          onDownload={(kind) => handleDownload(kind, tables, dataTableTitle)}
          showViewToggle={showViewSwitcher}
          isCardsView={isCardsView}
          onToggleView={(v) => setIsCardsView(!!v)}
        />
      )}

      {tables.map((table, index) => {
        const filteredData = getFilteredData(table)
        const effectiveTextSize: TextSize | undefined = table.textSize ?? textSize

        return (
          <CollapsibleSection
            key={index + 'table'}
            title={table.hidetitle?"":table?.title}
            enableCollapse={table.enableCollaps}
            defaultOpen={!startCollpas}
            rightContent={rightContent}
          >
            {tables.length === 1 && (
              <DataTableLayout
                onSearchChange={handleSearchChange}
                onCalendarClick={onCalendarClick}
                onFilterClick={onFilterClick}
                onFilterChange={handleFilterSelect}
                onDateRangeChange={(s?: Date | null, e?: Date | null) => {
                  handleDateChange(s ?? null, e ?? null)
                }}
                onSearch={onSearch}
                actionLabel={actionLabel}
                showCalendar={showCalendar}
                showFilter={showFilter}
                filterOptions={filterOptions}
                filterValue={filterValue ?? undefined}
                filterTitle={filterTitle}
                showButton={showButton}
                showRefresh={showRefresh}
                onRefreshPage={onRefreshPage}
                showDownloadTable={showDownloadTable}
                actionsRender={actionsRender}
                onTableActionClick={onTableActionClick}
                downloadDisabled={!(selectedRows[index]?.length)}
                onDownload={(kind) =>
                  handleDownload(kind, tables, dataTableTitle, index)
                }
                showViewToggle={showViewSwitcher}
                isCardsView={isCardsView}
                onToggleView={(v) => setIsCardsView(!!v)}
              />
            )}

            {isCardsView && table.cardAdapt ? (
              <CardsGrid
                data={filteredData as unknown as T[]}
                adapt={{
                  titleKey: table.cardAdapt.titleKey as any,
                  labelKey: table.cardAdapt.labelKey as any,
                  descriptionKey: table.cardAdapt.descriptionKey as any,
                  imageKey: table.cardAdapt.imageKey as any,
                  onPrimaryAction: table.cardAdapt.onPrimaryAction as any,
                  primaryLabel: table.cardAdapt.primaryLabel,
                  onSecondaryAction: table.cardAdapt.onSecondaryAction as any,
                  secondaryLabel: table.cardAdapt.secondaryLabel,
                  showPrimaryButton: table.cardAdapt.showPrimaryButton,
                  showSecondaryButton: table.cardAdapt.showSecondaryButton,
                  actionMenuProps: table.cardAdapt.actionMenuProps,
                  cardsPerPage: table.cardAdapt.cardsPerPage,
                }}
                rowsPerPage={rowsPerPage}
              />
            ) : (
              <DataTableContent
                data={filteredData}
                columns={table.columns}
                enableSelection={table.enableSelection}
                initialSelectedIds={table.initialSelectedRowIds}
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
                disableSelection={table.disableSelection}
                textSize={effectiveTextSize} // <-- aplica aquí
              />
            )}
          </CollapsibleSection>
        )
      })}
    </div>
  )
}
