import React from "react";
import { DataTableContentProps } from "./types";
import { DataTableHeader } from "./components/DataTableHeader/DataTableHeader";
import { DataTableBody } from "./components/DataTableBody/DataTableBody";
import { containerDataTableContent } from "./styles";
import Pagination from "@/app/components/Pagination/Pagination";
import { useDataTableContent } from "./hooks/useTableContent";

type ExtraProps = {
  rowHeight?: number;
  scrollMaxHeight?: number | string;
};

const DataTableContent = <T extends { id: string | number }>(
  props: DataTableContentProps<T> & ExtraProps
) => {
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
        />
      </div>

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
