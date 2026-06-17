import type { ReportView, TypesOfReportType, CategoriesType, ProjectReportSummary } from '@/app/mappings/reports/reports.types'

export type ReportsState = {
  // Datos
  reports: ReportView[]
  projectReports: ProjectReportSummary[]
  localReports: ReportView[]
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
  deleting: boolean

  successGet: boolean
  successPost: boolean
  successPut: boolean
  successDelete: boolean
  succesCurrent: boolean
  succesTypes: boolean
  succesCategories: boolean


  error?: string

  // Actions
  fetchAllReports: (force?: boolean) => Promise<void>
  fetchAllReportsByProyect: (idproyect: string, force?: boolean, idEmployee?: string) => Promise<void>
  createReport: (payload: ReportView) => Promise<ReportView | null>
  updateReport: (payload: ReportView) => Promise<ReportView | null>
  fetchReportsById: (idreport: string, force?: boolean) => Promise<void>
  fetchLocalReportById:(idreport: string, force?: boolean)=> Promise<void>
  fetchReportTypes: (force?: boolean) => Promise<void>
  fetchReportCategories: (idtype: string, force?: boolean) => Promise<void>
  fetchLocalReports: (force?: boolean,idProyect?:string) => Promise<ReportView[]>
  deleteLocal: (frontId: string) => Promise<boolean>
  deleteReport: (id: string, proyectId?: string) => Promise<boolean>
  setCurrentReport: (r: ReportView | null) => void
  clearCurrentReport: () => void
  resetCurrentReport: () => void
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial: Partial<ReportsState> | ((s: ReportsState) => Partial<ReportsState>)
) => void

export type Get = () => ReportsState


