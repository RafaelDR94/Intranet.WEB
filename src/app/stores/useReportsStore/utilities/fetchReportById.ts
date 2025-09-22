import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { ReportsByID } from '@/app/configurations/Axios/urls'
import { ReportMap } from '@/app/mappings/reports/report.mapper'
import type { ReportView } from '@/app/mappings/reports/reports.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchReportsById = async (
  idreport: string,
  set: Set,
  _get: Get,
  force = true,
) => {
  // For this endpoint we usually need fresh data by project
  if (_get().currentReport && !force) return
  set({ loadingCurrent: true, error: undefined, succesCurrent: false })
  try {
    const getFn = requireGateway('get')
    const url = `${ReportsByID}/${encodeURIComponent(idreport)}`
    const res: AxiosResponse = await pGet(getFn)(url)
    const list = res.data?.data ?? {}
    const mapped: ReportView = ReportMap(list);
  
    set({ currentReport: mapped, loadingCurrent: false, succesCurrent: true })
  } catch (e) {
    set({ loadingCurrent: false, succesCurrent: false, error: normalizeApiError(e).message })
  }
}

