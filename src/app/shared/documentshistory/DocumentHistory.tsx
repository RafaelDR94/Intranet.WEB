"use client"

import React from "react"

import { DataTable } from "@/app/components/DataTable/DataTable"

import {
  DOCUMENTS_HISTORY_PAGE_SIZE,
  DOCUMENTS_HISTORY_TABLE_TITLE,
} from "./constants"
import DocumentHistoryDetailsPanel from "./components/DocumentHistoryDetailsPanel"
import { useDocumentHistory } from "./hooks/useDocumentHistory"
import type { DocumentsHistoryScope } from "./types"

type DocumentHistoryProps = {
  scope: DocumentsHistoryScope
}

const EmptyState: React.FC<{
  message: string
  variant?: "info" | "error"
}> = ({ message, variant = "info" }) => (
  <div
    className={[
      "rounded-xl border p-4 text-b3",
      variant === "error"
        ? "border-danger-20 bg-danger-10 text-danger-90"
        : "border-gray-20 bg-white text-gray-70",
    ].join(" ")}
  >
    {message}
  </div>
)

export const DocumentHistory: React.FC<DocumentHistoryProps> = ({ scope }) => {
  const {
    columns,
    rows,
    currentPage,
    totalRows,
    filterOptions,
    filterValue,
    loadingList,
    loadingDetail,
    error,
    integrationPendingList,
    integrationPendingDetail,
    detailOpen,
    selectedDetail,
    selectedRow,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    refresh,
    closeDetails,
  } = useDocumentHistory(scope)

  const shouldShowEmptyState =
    !loadingList && rows.length === 0 && !error && !integrationPendingList

  return (
    <div className="relative space-y-4">
      <DataTable
        showCalendar
        showButton={false}
        showDownloadTable={false}
        showFilter
        showRefresh
        enableInternalSearch={false}
        enablePagination
        paginationMode="server"
        rowsPerPage={DOCUMENTS_HISTORY_PAGE_SIZE}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        filterOptions={filterOptions}
        filterValue={filterValue}
        filterTitle="Estatus"
        onFilterChange={handleFilterChange}
        onRefreshPage={refresh}
        tables={[
          {
            title: DOCUMENTS_HISTORY_TABLE_TITLE,
            data: rows,
            columns,
            enableSelection: false,
            totalRows,
          },
        ]}
      />

      {integrationPendingList && (
        <EmptyState message="Integracion pendiente. Agrega los endpoints NEXT_PUBLIC_BILLINGS_DOCUMENTS_HISTORY y NEXT_PUBLIC_BILLINGS_DOCUMENTS_HISTORY_BY_ID para habilitar el historico." />
      )}

      {error && <EmptyState message={error} variant="error" />}

      {loadingList && rows.length === 0 && (
        <EmptyState message="Cargando historico de facturas..." />
      )}

      {shouldShowEmptyState && (
        <EmptyState message="No hay facturas para mostrar con los filtros actuales." />
      )}

      <DocumentHistoryDetailsPanel
        open={detailOpen}
        detail={selectedDetail}
        fallbackRow={selectedRow}
        loading={loadingDetail}
        integrationPending={integrationPendingDetail}
        onClose={closeDetails}
      />
    </div>
  )
}

export default DocumentHistory
