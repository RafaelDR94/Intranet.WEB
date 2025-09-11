'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingPettyCashFund } from '@/app/configurations/Axios/urls'
import { PettyCashFundsMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene los fondos de caja chica del backend.
 */
export const fetchPettyCashFunds = async (set: Set, get: Get, force = false) => {
  if (get().pettyCashFunds.length > 0 && !force) return

  set({ loading: true, error: undefined, successGetFunds: false })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(BillingPettyCashFund)
    const mapped = PettyCashFundsMap(res.data?.data ?? [])
    set({ pettyCashFunds: mapped, loading: false, successGetFunds: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGetFunds: false })
  }
}

