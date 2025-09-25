'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingPettyCashFundById } from '@/app/configurations/Axios/urls'
import { PettyCashFundMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene un fondo de caja chica por ID.
 */
export const fetchPettyCashFundById = async (
  id: string,
  set: Set,
  get: Get,
  force = false
) => {
  if (get().pettyCashFund?.id === id && !force) return get().pettyCashFund ?? null

  set({ loading: true, error: undefined, successGetFund: false })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${BillingPettyCashFundById}/${id}`)
    const mapped = PettyCashFundMap(res.data?.data ?? {})
    set({ pettyCashFund: mapped, loading: false, successGetFund: true })
    return mapped
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGetFund: false })
    return null
  }
}

