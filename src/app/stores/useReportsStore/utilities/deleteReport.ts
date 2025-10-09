'use client'

import type { Get, Set } from '../types'

import { ReportsDelete } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const deleteReport = async (
  set: Set,
  get: Get,
  id: string,
  proyectId?: string
): Promise<boolean> => {
  const identifier = id?.trim()

  if (!identifier) {
    return false
  }

  set({ deleting: true, error: undefined, successDelete: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    await del(`${ReportsDelete}/${encodeURIComponent(identifier)}`)

    set((state) => {
      const shouldClearCurrent = [state.currentReport?.id, state.currentReport?.front_identifier].includes(identifier)
      const updatedReports = state.reports.filter((report) => {
        return ![report.id, report.front_identifier].includes(identifier)
      })

      return {
        deleting: false,
        successDelete: true,
        reports: updatedReports,
        currentReport: shouldClearCurrent ? null : state.currentReport,
      }
    })

    if (proyectId) {
      await get().fetchAllReportsByProyect(proyectId, true)
    }

    return true
  } catch (error) {
    set({ deleting: false, successDelete: false, error: normalizeApiError(error).message })
    return false
  }
}

