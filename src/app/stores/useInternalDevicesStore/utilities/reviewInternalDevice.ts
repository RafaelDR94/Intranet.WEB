'use client'

import type { Get, Set } from '../types'

import { ReviewDevices } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchInternalDevices } from './fetchInternalDevices'

/**
 * Mark device as reviewed/unreviewed.
 */
export const reviewInternalDevice = async (
  set: Set,
  get: Get,
  idDevice: string,
  reviewed: boolean,
): Promise<boolean> => {
  set({ reviewingDevice: true, error: undefined, successReviewDevice: false })

  try {
    const params = new URLSearchParams({
      idDevice,
      Reviewed: String(reviewed),
    })
    const url = `${ReviewDevices}?${params.toString()}`

    const put = pPut(requireGateway('put'), [200, 204])
    await put(url, {})

    await fetchInternalDevices(set, get, true)

    set({ reviewingDevice: false, successReviewDevice: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      reviewingDevice: false,
      successReviewDevice: false,
      error: err.message,
    })
    return false
  }
}
