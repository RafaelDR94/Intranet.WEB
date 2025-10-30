'use client'
import type { AxiosResponse } from 'axios'

import { Set } from '../types'

import { BillingPettyCashVoucher } from '@/app/configurations/Axios/urls'
import { PettyCashVoucherMap, PutPettyCashVoucherMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import type { PutPettyCashVoucher, PettyCashVoucherData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Actualiza un vale de caja chica.
 */
export const updatePettyCashVoucher = async (
  set: Set,
  payload: PutPettyCashVoucher
): Promise<PettyCashVoucherData | null> => {
  set({ updating: true, error: undefined, successPutVoucher: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const res: AxiosResponse = await put(BillingPettyCashVoucher, PutPettyCashVoucherMap(payload))
    const raw = res.data?.data
    const updated = raw ? PettyCashVoucherMap(raw) : null
    set({ updating: false, successPutVoucher: true })
    return updated
  } catch (e) {
    const err = normalizeApiError(e)
    set({ updating: false, successPutVoucher: false, error: err.message })
    return null
  }
}

