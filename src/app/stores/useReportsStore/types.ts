import type { ReportView, ReportPost, ReportPut, TypesOfReportType, CategoriesType } from '@/app/mappings/reports/reports.types'

export type ReportsState = {
  // Datos
  reports: ReportView[]
  typesofReports: TypesOfReportType[]
  reportCategories: CategoriesType[]
  reportCategoriesTypeId: string | null

  currentReport: ReportView | null

  // Flags
  loading: boolean
  loadingCurrent: boolean
  loadingTypes: boolean
  loadingCategories: boolean
  creating: boolean
  updating: boolean

  successGet: boolean
  successPost: boolean
  successPut: boolean
  succesCurrent: boolean
  succesTypes: boolean
  succesCategories: boolean


  error?: string

  // Actions
  fetchAllReports: (force?: boolean) => Promise<void>
  fetchAllReportsByProyect: (idproyect: string, force?: boolean) => Promise<void>
  createReport: (payload: ReportPost) => Promise<ReportView | null>
  updateReport: (payload: ReportPut) => Promise<ReportView | null>
  fetchReportsById: (idreport: string, force?: boolean) => Promise<void>
  fetchReportTypes: (force?: boolean) => Promise<void>
  fetchReportCategories: (idtype:string,force?: boolean) => Promise<void>
  setCurrentReport: (r: ReportView | null) => void
  clearCurrentReport: () => void

  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial: Partial<ReportsState> | ((s: ReportsState) => Partial<ReportsState>)
) => void

export type Get = () => ReportsState

