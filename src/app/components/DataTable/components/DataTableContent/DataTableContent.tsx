import React, { useEffect } from "react";

import { useIsMobile } from "../DataTableLayout/hooks/useMediaQuery";

import { DataTableBody } from "./components/DataTableBody/DataTableBody";
import type { TextSize } from "./components/DataTableBody/DataTableBody";
import { DataTableHeader } from "./components/DataTableHeader/DataTableHeader";
import { useDataTableContent } from "./hooks/useTableContent";
import { containerDataTableContent } from "./styles";
import { DataTableContentProps } from "./types";

import { Button } from "@/app/components/Button/Button";
import Pagination from "@/app/components/Pagination/Pagination";

// Opcional: pequeño contenedor para las acciones en mobile, por estilo
const MobileActionsBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-4 flex w-full items-center justify-between gap-3">
    {children}
  </div>
);

type ExtraProps = {
  rowHeight?: number;
  scrollMaxHeight?: number | string;
  /** Nuevo: tamaños de texto para el body */
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
    defaultSortKey,
    defaultSortDirection,
    enablePagination = true,
    rowsPerPage = 10,
    totalRows,
    enableInternalSearch = true,
    onPageChange,
    rowHeight = 56,
    scrollMaxHeight,
    onSelectedChange,
    showButton,
    actionsRender,
    onTableActionClick,
    actionLabel = "Agregar",
    textSize, // <-- NUEVO
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
    currentPage,
    totalPages,
    handlePage,
    showScroll,
    computedMaxHeight,
  } = useDataTableContent<T>({
    data,
    defaultSortKey,
    defaultSortDirection,
    enablePagination,
    rowsPerPage,
    totalRows,
    enableInternalSearch,
    onPageChange,
    rowHeight,
    scrollMaxHeight,
  });

  useEffect(() => {
    onSelectedChange?.(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

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

      <div
        className={showScroll ? "overflow-y-auto" : undefined}
        style={showScroll ? { maxHeight: computedMaxHeight } : undefined}
      >
        <DataTableBody
          data={paginatedData}
          columns={columns}
          enableSelection={enableSelection}
          selected={selected}
          onToggleSelect={toggleSelect}
          textSize={textSize}   // <-- pasa la prop
        />
      </div>

      {isMobile && (
        <MobileActionsBar>
          {/* `actionsRender` tiene prioridad */}
          {actionsRender
            ? actionsRender()
            : showButton && (
                <Button
                  variant="solid"
                  size="giant"
                  hideIcon
                  onClick={onTableActionClick}
                >
                  {actionLabel}
                </Button>
              )}
        </MobileActionsBar>
      )}

      {enablePagination && totalPages > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePage}
          />
        </div>
      )}
    </div>
  );
};

export default DataTableContent;
