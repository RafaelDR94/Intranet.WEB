'use client'
import type { AxiosResponse } from 'axios'

import { Set } from '../types'

import { BillingPettyCashVoucher } from '@/app/configurations/Axios/urls'
import { DeletePettyCashVoucherIdMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Elimina un vale de caja chica.
 */
export const deletePettyCashVoucher = async (set: Set, id: string): Promise<boolean> => {
  set({ removing: true, error: undefined, successDeleteVoucher: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    const res: AxiosResponse = await del(`${BillingPettyCashVoucher}/${id}`)
    set({ removing: false, successDeleteVoucher: true })
    return Boolean(res)
  } catch (e) {
    const err = normalizeApiError(e)
    set({ removing: false, successDeleteVoucher: false, error: err.message })
    return false
  }
}

