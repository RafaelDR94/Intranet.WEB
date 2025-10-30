'use client'
import type { AxiosResponse } from 'axios'

import type { Set } from '../types'

import { BillingPettyCashVoucherHistoryAmount } from '@/app/configurations/Axios/urls'
import { PutPettyCashVoucherHistoryAmountMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import type { PutPettyCashVoucherHistoryAmount } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Actualiza el monto del vale y registra su historial.
 */
export const updatePettyCashVoucherAmount = async (
  set: Set,
  payload: PutPettyCashVoucherHistoryAmount,
): Promise<boolean> => {
  set({
    updating: true,
    successPutVoucherAmount: false,
    error: undefined,
  })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const res: AxiosResponse = await put(
      BillingPettyCashVoucherHistoryAmount,
      PutPettyCashVoucherHistoryAmountMap(payload),
    )

    set({
      updating: false,
      successPutVoucherAmount: true,
    })

    return Boolean(res)
  } catch (e) {
    const err = normalizeApiError(e)
    set({
      updating: false,
      successPutVoucherAmount: false,
      error: err.message,
    })
    return false
  }
}

