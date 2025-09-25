'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { fetchPettyCashVouchers } from './fetchPettyCashVouchers'

import { BillingPettyCashVoucher } from '@/app/configurations/Axios/urls'
import { PettyCashVoucherMap, PostPettyCashVoucherMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import type { PostPettyCashVoucher, PettyCashVoucherData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Crea un vale de caja chica.
 */
export const createPettyCashVoucher = async (
  set: Set,
  get: Get,
  payload: PostPettyCashVoucher
): Promise<PettyCashVoucherData | null> => {
  set({ creating: true, error: undefined, successPostVoucher: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(`${BillingPettyCashVoucher}`, PostPettyCashVoucherMap(payload))
    const raw = res.data?.data
    const created = raw ? PettyCashVoucherMap(raw) : null

    await fetchPettyCashVouchers(set, get, true)

    set({ creating: false, successPostVoucher: true })
    return created
  } catch (e) {
    const err = normalizeApiError(e)
    set({ creating: false, successPostVoucher: false, error: err.message })
    return null
  }
}

