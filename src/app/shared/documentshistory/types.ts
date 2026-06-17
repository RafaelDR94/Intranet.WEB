export type DocumentsHistoryScope = "accounting" | "operations"

export type DocumentsHistoryStatusFilter =
  | "all"
  | "pending"
  | "validated"
  | "rejected"

export type DocumentsHistoryQuery = {
  page: number
  pageSize: number
  searchText: string
  startDate: Date | null
  endDate: Date | null
  filter: string | null
  scope: DocumentsHistoryScope
}

export type DocumentsHistoryListItem = {
  id: string
  employeeName: string
  companyName: string
  projectName: string
  requisitionCode: string
  uuid: string
  status: string
  sortDate?: string
  xmlUrl?: string | null
  pdfUrl?: string | null
  imageUrl?: string | null
}

export type DocumentHistoryConcept = {
  id: string
  satKey: string
  description: string
  quantity?: number
  unitValue?: number
  amount?: number
  taxPercentage?: number
  expenseType?: string
  ivaGroup?: string
}

export type DocumentHistoryDetail = DocumentsHistoryListItem & {
  certificationDate: string
  rfcEmisor: string
  rfcReceptor: string
  subtotal: number
  iva: number
  total: number
  comments: string
  userComments: string
  concepts: DocumentHistoryConcept[]
}

export type DocumentsHistoryPage = {
  items: DocumentsHistoryListItem[]
  totalRows: number
  page: number
  pageSize: number
}
