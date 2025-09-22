'use client'
import type { AxiosResponse } from 'axios'

import { Set } from '../types'

import { BillingPettyCashFund } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Elimina un fondo de caja chica.
 */
export const deletePettyCashFund = async (set: Set, id: string): Promise<boolean> => {
  set({ removing: true, error: undefined, successDeleteFund: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 201])
    const res: AxiosResponse = await del(`${BillingPettyCashFund}/${id}`)
    set({ removing: false, successDeleteFund: true })
    return Boolean(res)
  } catch (e) {
    const err = normalizeApiError(e)
    set({ removing: false, successDeleteFund: false, error: err.message })
    return false
  }
}

