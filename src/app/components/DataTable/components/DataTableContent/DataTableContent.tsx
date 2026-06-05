import React, { useEffect, useRef } from "react";

import { useIsMobile } from "../DataTableLayout/hooks/useMediaQuery";

import { DataTableBody } from "./components/DataTableBody/DataTableBody";
import type { TextSize } from "./components/DataTableBody/DataTableBody";
import { DataTableHeader } from "./components/DataTableHeader/DataTableHeader";
import { useDataTableContent } from "./hooks/useTableContent";
import { containerDataTableContent } from "./styles";
import { DataTableContentProps } from "./types";

import Pagination from "@/app/components/Pagination/Pagination";

// Opcional: pequeÃ±o contenedor para las acciones en mobile, por estilo
const MobileActionsBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 flex w-full items-center justify-between gap-3">
    {children}
  </div>
);

type ExtraProps = {
  rowHeight?: number;
  scrollMaxHeight?: number | string;
  /** Nuevo: tamaÃ±os de texto para el body */
  textSize?: TextSize;
};

const DataTableContent = <T extends { id: string | number }>(
  props: DataTableContentProps<T> & ExtraProps
) => {
  const isMobile = useIsMobile();
  const {
    data,
    columns,
    enableSelection = false,
    initialSelectedIds,
    defaultSortKey,
    defaultSortDirection,
    enablePagination = true,
    paginationMode = "client",
    rowsPerPage = 10,
    currentPage,
    totalRows,
    enableInternalSearch = true,
    onPageChange,
    rowHeight = 56,
    scrollMaxHeight,
    onSelectedChange,
    actionsRender,
    textSize, // <-- NUEVO
    disableSelection,
    selectionMode,
    selectionDataTour,
  } = props;

  const {
    selected,
    allSelected,
    toggleSelect,
    selectAll,
    sortKey,
    sortDirection,
    handleSort,
    paginatedData,
    currentPage: resolvedCurrentPage,
    totalPages,
    handlePage,
    showScroll,
    computedMaxHeight,
  } = useDataTableContent<T>({
    data,
    defaultSortKey,
    defaultSortDirection,
    initialSelectedIds,
    enablePagination,
    paginationMode,
    rowsPerPage,
    currentPage,
    totalRows,
    enableInternalSearch,
    onPageChange,
    rowHeight,
    scrollMaxHeight,
    selectionMode,
  });
  const init = useRef(false)
  useEffect(() => {
    if (init.current) onSelectedChange?.(selected);
    init.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className={containerDataTableContent}>
      <DataTableHeader
        columns={columns}
        enableSelection={enableSelection}
        disableSelection={disableSelection}
        selectionMode={selectionMode}
        allSelected={allSelected}
        onSelectAll={selectAll}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
      />

      <div
        className={showScroll ? "overflow-y-auto" : undefined}
        style={showScroll ? { maxHeight: computedMaxHeight } : undefined}
      >
        <DataTableBody
          data={paginatedData}
          columns={columns}
          enableSelection={enableSelection}
          disableSelection={disableSelection}
          selectionMode={selectionMode}
          selected={selected}
          onToggleSelect={toggleSelect}
          selectionDataTour={selectionDataTour}
          textSize={textSize}   // <-- pasa la prop
        />
      </div>

      {isMobile && (
        <MobileActionsBar>
          {/* `actionsRender` tiene prioridad sobre el botÃ³n, igual que en Layout */}
          {actionsRender?.()}
        </MobileActionsBar>
      )}

      {enablePagination && totalPages > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={resolvedCurrentPage}
            totalPages={totalPages}
            onPageChange={handlePage}
          />
        </div>
      )}
    </div>
  );
};

export default DataTableContent;

