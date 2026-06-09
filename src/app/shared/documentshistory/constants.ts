import type { LabelType } from "@/app/components/Label/types"
import type { DataTableFilterOption } from "@/app/components/DataTable/types"

import type {
  DocumentsHistoryListItem,
  DocumentsHistoryQuery,
  DocumentsHistoryScope,
} from "./types"

export const DOCUMENTS_HISTORY_PAGE_SIZE = 12
export const DOCUMENTS_HISTORY_SEARCH_DEBOUNCE_MS = 400
export const DOCUMENTS_HISTORY_DEFAULT_FILTER = "0"
export const DOCUMENTS_HISTORY_TABLE_TITLE = "Historico de facturas"

export const DOCUMENTS_HISTORY_STATUS_FILTER_OPTIONS: DataTableFilterOption<DocumentsHistoryListItem>[] =
  [
    { label: "Todos", value: DOCUMENTS_HISTORY_DEFAULT_FILTER },
    { label: "Validado", value: "1" },
    { label: "No validado", value: "2" },
    { label: "SAT", value: "3" },
    { label: "SAP", value: "4" },
  ]

export const createInitialDocumentsHistoryQuery = (
  scope: DocumentsHistoryScope,
): DocumentsHistoryQuery => {
  return {
    page: 1,
    pageSize: DOCUMENTS_HISTORY_PAGE_SIZE,
    searchText: "",
    startDate: null,
    endDate: null,
    filter: DOCUMENTS_HISTORY_DEFAULT_FILTER,
    scope,
  }
}

export const resolveDocumentsHistoryStatusType = (
  status?: string,
): LabelType => {
  const normalized = String(status ?? "").trim().toLowerCase()

  if (normalized.includes("valid")) return "validado"
  if (normalized.includes("rechaz")) return "rechazado"
  if (normalized.includes("restr")) return "restringido"
  if (normalized.includes("prohib")) return "prohibido"
  if (normalized.includes("proceso")) return "en-proceso"

  return "pendiente"
}
