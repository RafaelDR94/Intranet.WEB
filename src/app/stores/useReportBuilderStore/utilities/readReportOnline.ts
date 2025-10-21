import type { AxiosResponse } from 'axios'



import { ReportsByID } from '@/app/configurations/Axios/urls'
import { ReportMap } from '@/app/mappings/reports/report.mapper'
import type { ReportView } from '@/app/mappings/reports/reports.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { SetReportState, GetReportState } from '../types'

export const readReportOnline = async (
    idreport: string,
    set: SetReportState,
    _get: GetReportState,
    force = true,
) => {
    // For this endpoint we usually need fresh data by project
    set({ readingDB: true, succesreadingDB: false, error: undefined });
    if (_get().report.id && !force) return
    try {
        const getFn = requireGateway('get')
        const url = `${ReportsByID}/${encodeURIComponent(idreport)}`
        const res: AxiosResponse = await pGet(getFn)(url)
        const list = res.data?.data ?? {}
        const mapped: ReportView = ReportMap(list);
        set({ report: mapped, readingDB: false, succesreadingDB: true })

    } catch (e) {
        set({ readingDB: false, succesreadingDB: false, error: normalizeApiError(e).message })
    }
}

