import type { ReportView, ReportPost, ReportPut } from '@/app/mappings/reports/reports.types'

export type ReportsState = {
  // Datos
  reports: ReportView[]
  currentReport: ReportView | null

  // Flags
  loading: boolean
  creating: boolean
  updating: boolean

  successGet: boolean
  successPost: boolean
  successPut: boolean

  error?: string

  // Actions
  fetchAllReports: (force?: boolean) => Promise<void>
  fetchAllReportsByProyect: (idproyect: string, force?: boolean) => Promise<void>
  createReport: (payload: ReportPost) => Promise<ReportView | null>
  updateReport: (payload: ReportPut) => Promise<ReportView | null>

  setCurrentReport: (r: ReportView | null) => void
  clearCurrentReport: () => void

  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial: Partial<ReportsState> | ((s: ReportsState) => Partial<ReportsState>)
) => void

export type Get = () => ReportsState

