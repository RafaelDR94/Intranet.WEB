import { reportsdb } from '@/app/configurations/DataBase/bases'
import { readAllDocuments } from '@/app/configurations/DataBase/crud'
import type { ReportView } from '@/app/mappings/reports/reports.types'
import type { ReportDocument } from '@/app/stores/useReportBuilderStore/utilities/helpers'

import type { Get, Set } from '../types'

const toReportView = (doc: ReportDocument | undefined): ReportView | null => {
  if (!doc || !doc.report) return null

  const stored = doc.report
  const dexieId = doc.id != null ? String(doc.id) : undefined
  const frontIdentifier = stored.front_identifier ?? doc.frontId ?? stored.id ?? dexieId

  const reportId = stored.id ?? frontIdentifier ?? dexieId ?? `local-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`

  return {
    ...stored,
    id: reportId,
    idSpareParts: stored.idSpareParts ?? [],
    front_identifier: frontIdentifier ?? reportId,
    datecreate: doc.dateCreated ?? stored.datecreate ?? '',
  }
}

export const fetchLocalReports = async (
  set: Set,
  get: Get,
  force = false,
  idProyect?: string,
): Promise<ReportView[]> => {
  if (!force && get().localReports.length > 0) {
    return get().localReports
  }

  try {
    set({ localReports: [] })
    const docs = await readAllDocuments(reportsdb)
    const mapped = (docs ?? [])
      .map((raw) => toReportView(raw as ReportDocument))
      .filter((report): report is ReportView => Boolean(report))
    set({ localReports: idProyect ? mapped.filter((report) => report.proyect.id === idProyect) : mapped })
    return mapped
  } catch (error) {
    console.error('Error fetching local reports', error)
    set({ localReports: [] })
    return []
  }
}
