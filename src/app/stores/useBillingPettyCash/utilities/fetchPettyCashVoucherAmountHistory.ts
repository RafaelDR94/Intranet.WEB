'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { BillingPettyCashVoucherHistoryAmount } from '@/app/configurations/Axios/urls'
import { PettyCashVoucherHistoryAmountMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import type { PettyCashVoucherHistoryAmountItem } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene el historial de montos de un vale de caja chica.
 */
export const fetchPettyCashVoucherAmountHistory = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<PettyCashVoucherHistoryAmountItem[] | null> => {
  const { pettyCashVoucherAmountHistoryId, pettyCashVoucherAmountHistory } = get()

  if (!force && pettyCashVoucherAmountHistoryId === id && pettyCashVoucherAmountHistory.length) {
    return pettyCashVoucherAmountHistory
  }

  set({
    loadingAmountHistory: true,
    successGetVoucherAmountHistory: false,
    warning: undefined,
  })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${BillingPettyCashVoucherHistoryAmount}/${id}`)
    const raw = res?.data?.data ?? res?.data ?? []
    const mapped = PettyCashVoucherHistoryAmountMap(raw)

    set({
      pettyCashVoucherAmountHistory: mapped,
      pettyCashVoucherAmountHistoryId: id,
      loadingAmountHistory: false,
      successGetVoucherAmountHistory: true,
      warning: undefined,
    })

    return mapped
  } catch (e) {
    const err = normalizeApiError(e)
    set({
      loadingAmountHistory: false,
      successGetVoucherAmountHistory: false,
      warning: err.message,
    })
    return null
  }
}

