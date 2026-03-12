'use client'

import type { Get, Set } from '../types'

import { Reviews } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceReviews } from './fetchDeviceReviews'

/**
 * Delete device review.
 */
export const deleteDeviceReview = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({ deletingDeviceReview: true, error: undefined, successDeleteDeviceReview: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    await del(`${Reviews}/${id}`)

    await fetchDeviceReviews(set, get, true)

    set({ deletingDeviceReview: false, successDeleteDeviceReview: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      deletingDeviceReview: false,
      successDeleteDeviceReview: false,
      error: err.message,
    })
    return false
  }
}
