import type {
  DocumentsHistoryQuery,
} from "@/app/shared/documentshistory/types"

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "")

const toDateTimeParam = (
  value: Date | null,
  boundary: "start" | "end",
) => {
  const baseDate = value ? new Date(value) : new Date()

  if (boundary === "start") {
    baseDate.setHours(0, 0, 0, 0)
  } else {
    baseDate.setHours(23, 59, 59, 999)
  }

  const year = baseDate.getFullYear()
  const month = String(baseDate.getMonth() + 1).padStart(2, "0")
  const day = String(baseDate.getDate()).padStart(2, "0")
  const hours = String(baseDate.getHours()).padStart(2, "0")
  const minutes = String(baseDate.getMinutes()).padStart(2, "0")
  const seconds = String(baseDate.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

const toFilterNumber = (value: string | null) => {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export const serializeDocumentsHistoryQuery = (
  query: DocumentsHistoryQuery,
) => {
  const params = new URLSearchParams()

  params.set("StartDate", toDateTimeParam(query.startDate, "start"))
  params.set("EndDate", toDateTimeParam(query.endDate, "end"))
  params.set("PageNumber", String(query.page))
  params.set("PageSize", String(query.pageSize))
  params.set("Text", query.searchText)
  params.set("Filter", String(toFilterNumber(query.filter)))

  return params
}

export const buildDocumentsHistoryUrl = (
  baseUrl: string,
  query: DocumentsHistoryQuery,
) => {
  const queryString = serializeDocumentsHistoryQuery(query).toString()
  const trimmedBaseUrl = trimTrailingSlash(baseUrl)

  return queryString ? `${trimmedBaseUrl}?${queryString}` : trimmedBaseUrl
}

export const buildDocumentsHistoryDetailUrl = (
  baseUrl: string,
  id: string,
) => {
  const trimmedBaseUrl = trimTrailingSlash(baseUrl)
  return `${trimmedBaseUrl}/${encodeURIComponent(id)}`
}
