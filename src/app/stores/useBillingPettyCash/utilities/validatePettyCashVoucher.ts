'use client'
import type { AxiosResponse } from 'axios'

import { Set } from '../types'

import { BillingPettyCashVoucherValidate } from '@/app/configurations/Axios/urls'
import { PutPettyCashValidateIdMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Valida un vale de caja chica.
 */
export const validatePettyCashVoucher = async (set: Set, id: string): Promise<boolean> => {
  set({ validating: true, error: undefined, successValidateVoucher: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const res: AxiosResponse = await put(`${BillingPettyCashVoucherValidate}/${id}`, PutPettyCashValidateIdMap({ id }))
    set({ validating: false, successValidateVoucher: true })
    return Boolean(res)
  } catch (e) {
    const err = normalizeApiError(e)
    set({ validating: false, successValidateVoucher: false, error: err.message })
    return false
  }
}

