'use client'

import { reportsdb } from '@/app/configurations/DataBase/bases'
import { deleteDocument } from '@/app/configurations/DataBase/crud'
import { findReportDocumentByFrontId } from '@/app/stores/useReportBuilderStore/utilities/helpers'

import type { Get, Set } from '../types'

export const deleteLocalReport = async (set: Set, _get: Get, frontId: string): Promise<boolean> => {
  const identifier = frontId?.trim()
  if (!identifier) {
    return false
  }

  try {
    const existing = await findReportDocumentByFrontId(identifier)

    if (existing?.id != null) {
      await deleteDocument(existing.id, reportsdb)
    } else {
      const numericId = Number(identifier)
      if (!Number.isNaN(numericId)) {
        await deleteDocument(numericId, reportsdb)
      }
    }

    set((state) => {
      const shouldClearCurrent = [state.currentReport?.front_identifier, state.currentReport?.id].includes(identifier)
      const updatedLocalReports = state.localReports.filter((report) => {
        return ![report.front_identifier, report.id].includes(identifier)
      })

      return {
        localReports: updatedLocalReports,
        currentReport: shouldClearCurrent ? null : state.currentReport,
      }
    })

    return true
  } catch (error) {
    console.error('Error deleting local report', error)
    return false
  }
}
