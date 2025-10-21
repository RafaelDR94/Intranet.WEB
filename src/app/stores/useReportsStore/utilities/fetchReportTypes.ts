import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { ReportsTypesReports } from '@/app/configurations/Axios/urls'
import { mapTypesOfReports } from '@/app/mappings/reports/report.mapper'
import { TypesOfReportType } from '@/app/mappings/reports/reports.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchReportTypes = async (set: Set, get: Get, force = false) => {
  if (get().typesofReports.length > 0 && !force) return

  set({ typesofReports: [], loadingTypes: true, error: undefined, succesTypes: false })
  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(ReportsTypesReports)
    const raw = res.data?.data ?? []
    const mapped: TypesOfReportType[] = mapTypesOfReports(raw)
    set({ typesofReports: mapped, loadingTypes: false, succesTypes: true })
  } catch (e) {
    set({ loadingTypes: false, succesTypes: false, error: normalizeApiError(e).message })
  }
}
