'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { BillingRequisitionWithEmployees as BillingRequisitionWithEmployeesUrl } from '@/app/configurations/Axios/urls'
import { BillingRequisitionsWithEmployeesMap } from '@/app/mappings/billingRequisitionWithEmployees/billingRequisitionWithEmployees.map'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene requisiciones incluyendo datos de empleado.
 */
export const fetchBillingRequisitionsWithEmployees = async (
  startDate: string | undefined,
  endDate: string | undefined,
  set: Set,
  get: Get,
  force = false,
) => {
  if (get().requisitions.length > 0 && !force) return

  set({ loading: true, error: undefined, successGet: false, requisitions: [] })

  try {
    const GetFn = requireGateway('get')
    const getReq = pGet(GetFn)

    const params = new URLSearchParams({ active: 'true' })
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    const query = params.toString()
    const url = query
      ? `${BillingRequisitionWithEmployeesUrl}?${query}`
      : BillingRequisitionWithEmployeesUrl

    const res: AxiosResponse = await getReq(url)
    const mapped = BillingRequisitionsWithEmployeesMap(res.data?.data ?? [])

    set({ requisitions: mapped, loading: false, successGet: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
  }
}
