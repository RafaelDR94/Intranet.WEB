import type {
  DocumentHistoryDetail,
  DocumentsHistoryPage,
  DocumentsHistoryQuery,
  DocumentsHistoryScope,
  DocumentsHistoryListItem,
} from "@/app/shared/documentshistory/types"

export type DocumentsHistoryState = {
  list: DocumentsHistoryListItem[]
  detailById: Record<string, DocumentHistoryDetail>
  totalRows: number
  currentPage: number
  pageSize: number
  query: DocumentsHistoryQuery | null
  loadingList: boolean
  loadingDetail: boolean
  integrationPendingList: boolean
  integrationPendingDetail: boolean
  error?: string
  fetchDocumentsHistory: (
    query: DocumentsHistoryQuery,
    force?: boolean,
  ) => Promise<DocumentsHistoryPage | null>
  fetchDocumentHistoryDetail: (
    id: string,
    scope: DocumentsHistoryScope,
    force?: boolean,
  ) => Promise<DocumentHistoryDetail | null>
  reset: () => void
}

export type Set = (
  partial:
    | Partial<DocumentsHistoryState>
    | ((state: DocumentsHistoryState) => Partial<DocumentsHistoryState>),
) => void

export type Get = () => DocumentsHistoryState
