import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { ReportsCategoriesByIdType } from '@/app/configurations/Axios/urls'
import { mapCategories } from '@/app/mappings/reports/report.mapper'
import type { CategoriesType } from '@/app/mappings/reports/reports.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchReportCategories = async (
  idtype: string,
  set: Set,
  get: Get,
  force = false,
) => {
  const typeId = idtype?.trim?.() ?? ''
  if (!typeId) {
    set({
      reportCategories: [],
      reportCategoriesTypeId: null,
      loadingCategories: false,
      succesCategories: false,
    })
    return
  }

  const { reportCategories, reportCategoriesTypeId } = get()
  if (reportCategories.length > 0 && reportCategoriesTypeId === typeId && !force) return

  set({
    reportCategories: [],
    reportCategoriesTypeId: typeId,
    loadingCategories: true,
    error: undefined,
    succesCategories: false,
  })
  try {
    const getFn = requireGateway('get')
    const url = `${ReportsCategoriesByIdType}/${encodeURIComponent(typeId)}`
    const res: AxiosResponse = await pGet(getFn)(url)
    const raw = res.data?.data ?? []
    const mapped: CategoriesType[] = mapCategories(raw)
    set({
      reportCategories: mapped,
      reportCategoriesTypeId: typeId,
      loadingCategories: false,
      succesCategories: true,
    })
  } catch (e) {
    set({
      loadingCategories: false,
      succesCategories: false,
      error: normalizeApiError(e).message,
    })
  }
}
