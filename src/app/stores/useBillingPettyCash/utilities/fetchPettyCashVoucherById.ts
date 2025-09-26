'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingPettyCashVoucherById } from '@/app/configurations/Axios/urls'
import { PettyCashVoucherFullMap, PettyCashVoucherMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene un vale de caja chica por ID.
 */
export const fetchPettyCashVoucherById = async (
  id: string,
  set: Set,
  get: Get,
  force = false
) => {
  const { pettyCashVoucherFull } = get()
  if (pettyCashVoucherFull?.id === id && !force) return pettyCashVoucherFull

  set({ loading: true, error: undefined, successGetVoucher: false })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${BillingPettyCashVoucherById}/${id}`)
    const raw = res.data?.data ?? {}
    const mappedFull = PettyCashVoucherFullMap(raw)
    const mappedLight = PettyCashVoucherMap(raw)
    set({
      pettyCashVoucher: mappedLight,
      pettyCashVoucherFull: mappedFull,
      loading: false,
      successGetVoucher: true,
    })
    return mappedFull
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGetVoucher: false })
    return null
  }
}

