'use client'
import type { AxiosResponse } from 'axios'

import { Set } from '../types'

import { BillingCashOnHand } from '@/app/configurations/Axios/urls'
import { PutCashOnHandMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import type { PutCashOnHand } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Actualiza el efectivo en caja.
 */
export const updateCashOnHand = async (
  set: Set,
  payload: PutCashOnHand
): Promise<boolean> => {
  set({ updating: true, error: undefined, successCashOnHand: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const res: AxiosResponse = await put(BillingCashOnHand, PutCashOnHandMap(payload))
    set({ updating: false, successCashOnHand: true })
    return Boolean(res)
  } catch (e) {
    const err = normalizeApiError(e)
    set({ updating: false, successCashOnHand: false, error: err.message })
    return false
  }
}

