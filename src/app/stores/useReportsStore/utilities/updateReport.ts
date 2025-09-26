'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Reports } from '@/app/configurations/Axios/urls'
import { ReportPutMap } from '@/app/mappings/reports/report.mapper'
import type { ReportView, ReportPut } from '@/app/mappings/reports/reports.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const updateReport = async (
  set: Set,
  get: Get,
  payload: ReportPut
): Promise<ReportView | null> => {
  set({ updating: true, error: undefined, successPut: false })
  try {
    const put = pPut(requireGateway('put'), [200, 204])
    // Se envía como string serializado
    const res: AxiosResponse = await put(Reports, ReportPutMap(payload))
    const raw = res.data?.data
    const updated: ReportView | null = raw ?? null

    await get().fetchAllReports(true)

    set({ updating: false, successPut: true })
    return updated
  } catch (e) {
    set({ updating: false, successPut: false, error: normalizeApiError(e).message })
    return null
  }
}

