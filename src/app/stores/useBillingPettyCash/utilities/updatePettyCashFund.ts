'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingPettyCashFund } from '@/app/configurations/Axios/urls'
import { PettyCashFundMap, PutPettyCashFundMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import type { PutPettyCashFund, PettyCashFundData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Actualiza un fondo de caja chica.
 */
export const updatePettyCashFund = async (
  set: Set,
  get: Get,
  payload: PutPettyCashFund
): Promise<PettyCashFundData | null> => {
  set({ updating: true, error: undefined, successPutFund: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const res: AxiosResponse = await put(BillingPettyCashFund, PutPettyCashFundMap(payload))
    const raw = res.data?.data
    const updated = raw ? PettyCashFundMap(raw) : null

    set({ updating: false, successPutFund: true })
    return updated
  } catch (e) {
    const err = normalizeApiError(e)
    set({ updating: false, successPutFund: false, error: err.message })
    return null
  }
}

