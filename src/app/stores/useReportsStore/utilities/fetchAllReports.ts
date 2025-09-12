import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { ReportsAllReports } from '@/app/configurations/Axios/urls'
import { ReportsMap } from '@/app/mappings/reports/report.mapper'
import { ReportView } from '@/app/mappings/reports/reports.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchAllReports = async (set: Set, get: Get, force = false) => {
  if (get().reports.length > 0 && !force) return

  set({ loading: true, error: undefined, successGet: false })
  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(ReportsAllReports)
    const raw = res.data?.data ?? []
    const mapped: ReportView[] = ReportsMap(raw)
    set({ reports: mapped, loading: false, successGet: true })
  } catch (e) {
    set({ loading: false, successGet: false, error: normalizeApiError(e).message })
  }
}

