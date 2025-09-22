'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { fetchPettyCashFundById } from './fetchPettyCashFundById'
import { fetchPettyCashFunds } from './fetchPettyCashFunds'

import { BillingPettyCashFund } from '@/app/configurations/Axios/urls'
import { PettyCashFundMap, PostPettyCashFundMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import type { PostPettyCashFund, PettyCashFundData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Crea un fondo de caja chica.
 */
export const createPettyCashFund = async (
  set: Set,
  get: Get,
  payload: PostPettyCashFund
): Promise<PettyCashFundData | null> => {
  set({ creating: true, error: undefined, successPostFund: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(BillingPettyCashFund, PostPettyCashFundMap(payload))
    const raw = res.data?.data
    const created = raw ? PettyCashFundMap(raw) : null

    if (created) {
      set({ pettyCashFund: created })

      if (created.id) {
        await fetchPettyCashFundById(created.id, set, get, true)
      }
    }

    await fetchPettyCashFunds(set, get, true)

    set({ creating: false, successPostFund: true })
    return created
  } catch (e) {
    const err = normalizeApiError(e)
    set({ creating: false, successPostFund: false, error: err.message })
    return null
  }
}

