"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { shallow } from "zustand/shallow"

import { Button } from "@/app/components/Button/Button"
import type { ColumnDefinition } from "@/app/components/DataTable/types"
import Label from "@/app/components/Label/Label"
import { useDocumentsHistoryStore } from "@/app/stores/useDocumentsHistoryStore/useDocumentsHistoryStore"

import {
  createInitialDocumentsHistoryQuery,
  DOCUMENTS_HISTORY_DEFAULT_FILTER,
  DOCUMENTS_HISTORY_SEARCH_DEBOUNCE_MS,
  DOCUMENTS_HISTORY_STATUS_FILTER_OPTIONS,
  resolveDocumentsHistoryStatusType,
} from "../constants"
import type {
  DocumentsHistoryListItem,
  DocumentsHistoryQuery,
  DocumentsHistoryScope,
} from "../types"

const areDatesEqual = (left: Date | null, right: Date | null) =>
  left?.getTime() === right?.getTime()

const areQueriesEqual = (
  left: DocumentsHistoryQuery,
  right: DocumentsHistoryQuery,
) =>
  left.page === right.page &&
  left.pageSize === right.pageSize &&
  left.searchText === right.searchText &&
  areDatesEqual(left.startDate, right.startDate) &&
  areDatesEqual(left.endDate, right.endDate) &&
  left.filter === right.filter &&
  left.scope === right.scope

const matchesDocumentsHistoryFilter = (
  row: DocumentsHistoryListItem,
  filter: string | null,
) => {
  const normalizedFilter = filter ?? DOCUMENTS_HISTORY_DEFAULT_FILTER
  if (normalizedFilter === DOCUMENTS_HISTORY_DEFAULT_FILTER) return true

  const normalizedStatus = row.status.trim().toLowerCase()

  if (normalizedFilter === "1") {
    return (
      normalizedStatus.includes("valid") &&
      !normalizedStatus.includes("no valid") &&
      !normalizedStatus.includes("inval") &&
      !normalizedStatus.includes("rechaz")
    )
  }

  if (normalizedFilter === "2") {
    return (
      normalizedStatus.includes("pend") ||
      normalizedStatus.includes("rechaz") ||
      normalizedStatus.includes("inval") ||
      normalizedStatus.includes("no valid")
    )
  }

  if (normalizedFilter === "3") {
    return normalizedStatus.includes("sat")
  }

  if (normalizedFilter === "4") {
    return normalizedStatus.includes("sap")
  }

  return true
}

export const useDocumentHistory = (scope: DocumentsHistoryScope) => {
  const {
    list,
    detailById,
    totalRows,
    currentPage,
    pageSize,
    query,
    loadingList,
    loadingDetail,
    error,
    integrationPendingList,
    integrationPendingDetail,
    fetchDocumentsHistory,
    fetchDocumentHistoryDetail,
    reset,
  } = useDocumentsHistoryStore(
    (state) => ({
      list: state.list,
      detailById: state.detailById,
      totalRows: state.totalRows,
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      query: state.query,
      loadingList: state.loadingList,
      loadingDetail: state.loadingDetail,
      error: state.error,
      integrationPendingList: state.integrationPendingList,
      integrationPendingDetail: state.integrationPendingDetail,
      fetchDocumentsHistory: state.fetchDocumentsHistory,
      fetchDocumentHistoryDetail: state.fetchDocumentHistoryDetail,
      reset: state.reset,
    }),
    shallow,
  )

  const [searchInput, setSearchInput] = useState("")
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  )
  const [detailOpen, setDetailOpen] = useState(false)
  const [committedQuery, setCommittedQuery] = useState<DocumentsHistoryQuery>(
    () => createInitialDocumentsHistoryQuery(scope),
  )

  useEffect(() => {
    const initialQuery = createInitialDocumentsHistoryQuery(scope)
    setSearchInput("")
    setSelectedDocumentId(null)
    setDetailOpen(false)
    setCommittedQuery((previousQuery) =>
      areQueriesEqual(previousQuery, initialQuery)
        ? previousQuery
        : initialQuery,
    )
    reset()

    return () => reset()
  }, [scope, reset])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setCommittedQuery((previousQuery) => {
        if (previousQuery.searchText === searchInput) {
          return previousQuery
        }

        return {
          ...previousQuery,
          page: 1,
          searchText: searchInput,
        }
      })
    }, DOCUMENTS_HISTORY_SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    fetchDocumentsHistory({ ...committedQuery, scope })
  }, [committedQuery, fetchDocumentsHistory, scope])

  const selectedDetail = selectedDocumentId
    ? detailById[selectedDocumentId] ?? null
    : null

  const selectedRow = useMemo(
    () => list.find((row) => row.id === selectedDocumentId) ?? null,
    [list, selectedDocumentId],
  )

  const handleSearchChange = useCallback(
    (value: string, startDate?: Date | null, endDate?: Date | null) => {
      setSearchInput(value)

      setCommittedQuery((previousQuery) => {
        const nextStartDate = startDate ?? null
        const nextEndDate = endDate ?? null
        const datesDidChange =
          !areDatesEqual(previousQuery.startDate, nextStartDate) ||
          !areDatesEqual(previousQuery.endDate, nextEndDate)

        if (!datesDidChange) {
          return previousQuery
        }

        return {
          ...previousQuery,
          page: 1,
          startDate: nextStartDate,
          endDate: nextEndDate,
        }
      })
    },
    [],
  )

  const handleFilterChange = useCallback((value: string) => {
    setCommittedQuery((previousQuery) => ({
      ...previousQuery,
      page: 1,
      filter: value === DOCUMENTS_HISTORY_DEFAULT_FILTER ? null : value,
    }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCommittedQuery((previousQuery) => ({
      ...previousQuery,
      page,
    }))
  }, [])

  const refresh = useCallback(() => {
    fetchDocumentsHistory({ ...committedQuery, scope }, true)
  }, [committedQuery, fetchDocumentsHistory, scope])

  const openDetails = useCallback(
    async (documentId: string) => {
      setSelectedDocumentId(documentId)
      setDetailOpen(true)
      await fetchDocumentHistoryDetail(documentId, scope)
    },
    [fetchDocumentHistoryDetail, scope],
  )

  const closeDetails = useCallback(() => {
    setDetailOpen(false)
  }, [])

  const columns = useMemo<ColumnDefinition<DocumentsHistoryListItem>[]>(
    () => [
      {
        key: "employeeName",
        label: "Nombre",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "companyName",
        label: "Empresa",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "projectName",
        label: "Proyecto",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "requisitionCode",
        label: "Requisicion",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "uuid",
        label: "UUID",
        cellClass: "w-2/12",
        headerClass: "w-2/12",
      },
      {
        key: "status",
        label: "Estatus",
        render: (row) => (
          <Label
            type={resolveDocumentsHistoryStatusType(row.status)}
            text={row.status}
          />
        ),
        cellClass: "w-1/12",
        headerClass: "w-1/12",
      },
      {
        key: "id" as keyof DocumentsHistoryListItem,
        label: "Ver factura",
        render: (row) => (
          <Button
            variant="ghost"
            size="small"
            hideIcon
            onClick={() => openDetails(row.id)}
          >
            Ver factura
          </Button>
        ),
        cellClass: "w-1/12",
        headerClass: "w-1/12",
      },
    ],
    [openDetails],
  )

  const effectivePage = query?.scope === scope ? currentPage : committedQuery.page
  const effectivePageSize =
    query?.scope === scope ? pageSize : committedQuery.pageSize
  const filterValue =
    (query?.scope === scope ? query.filter : committedQuery.filter) ??
    DOCUMENTS_HISTORY_DEFAULT_FILTER
  const rows = useMemo(
    () => list.filter((row) => matchesDocumentsHistoryFilter(row, filterValue)),
    [filterValue, list],
  )

  return {
    columns,
    rows,
    currentPage: effectivePage,
    pageSize: effectivePageSize,
    totalRows,
    filterOptions: DOCUMENTS_HISTORY_STATUS_FILTER_OPTIONS,
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
    openDetails,
  }
}

export default useDocumentHistory
