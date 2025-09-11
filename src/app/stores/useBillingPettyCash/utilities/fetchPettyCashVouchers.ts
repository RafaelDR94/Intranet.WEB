'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingPettyCashVoucher } from '@/app/configurations/Axios/urls'
import { PettyCashVouchersMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene los vales de caja chica.
 */
export const fetchPettyCashVouchers = async (set: Set, get: Get, force = false) => {
  if (get().pettyCashVouchers.length > 0 && !force) return

  set({ loading: true, error: undefined, successGetVouchers: false })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(BillingPettyCashVoucher)
    const mapped = PettyCashVouchersMap(res.data?.data ?? [])
    set({ pettyCashVouchers: mapped, loading: false, successGetVouchers: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGetVouchers: false })
  }
}

