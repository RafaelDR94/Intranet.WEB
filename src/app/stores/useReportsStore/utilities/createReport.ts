'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Reports } from '@/app/configurations/Axios/urls'
import { ReportPostMap } from '@/app/mappings/reports/report.mapper'
import type { ReportView, ReportPost } from '@/app/mappings/reports/reports.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const createReport = async (
  set: Set,
  get: Get,
  payload: ReportPost
): Promise<ReportView | null> => {
  set({ creating: true, error: undefined, successPost: false })
  try {
    const post = pPost(requireGateway('post'), [200, 201])
    // El backend espera un string con el modelo serializado
    const res: AxiosResponse = await post(Reports, ReportPostMap(payload))
    const raw = res.data?.data
    const created: ReportView | null = raw ?? null

    // Refresca la lista general
    await get().fetchAllReports(true)

    set({ creating: false, successPost: true })
    return created
  } catch (e) {
    set({ creating: false, successPost: false, error: normalizeApiError(e).message })
    return null
  }
}

