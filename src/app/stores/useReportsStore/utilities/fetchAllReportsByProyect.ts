import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { ReportsAllReportsByIdProyect } from '@/app/configurations/Axios/urls'
import { ReportsMap } from '@/app/mappings/reports/report.mapper'
import type { ReportView } from '@/app/mappings/reports/reports.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchAllReportsByProyect = async (
  idproyect: string,
  set: Set,
  _get: Get,
  force = true,
  idEmployee?: string,
) => {
  // For this endpoint we usually need fresh data by project
  if (_get().reports.length > 0 && !force) return
  set({ reports: [], loading: true, error: undefined, successGet: false })
  try {
    console.log("idEmployee", idEmployee);
    const getFn = requireGateway('get')
    const baseUrl = `${ReportsAllReportsByIdProyect}/${encodeURIComponent(idproyect)}`
    // const baseUrl = `${ReportsAllReportsByIdProyect}?idproyect=${idproyect}`
    const query = new URLSearchParams()
    if (idEmployee) {
      query.set('idEmployee', idEmployee)
    }
    const url = query.toString() ? `${baseUrl}?${query.toString()}` : baseUrl
    const res: AxiosResponse = await pGet(getFn)(url)
    const list = res.data?.data ?? []
    const mapped: ReportView[] = ReportsMap(list);

    set({ reports: mapped, loading: false, successGet: true })
  } catch (e) {
    set({ loading: false, successGet: false, error: normalizeApiError(e).message })
  }
}

