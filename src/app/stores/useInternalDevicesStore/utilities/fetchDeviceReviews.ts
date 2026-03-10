'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Reviews } from '@/app/configurations/Axios/urls'
import { InternalDeviceReviewsMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceReview } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device reviews.
 */
export const fetchDeviceReviews = async (
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceReview[] | null> => {
  if (!force && get().deviceReviews.length > 0) return get().deviceReviews

  set({
    loadingDeviceReviews: true,
    error: undefined,
    successGetDeviceReviews: false,
  })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(Reviews)
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDeviceReviewsMap(Array.isArray(payload) ? payload : [])

    set({
      deviceReviews: list,
      loadingDeviceReviews: false,
      successGetDeviceReviews: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceReviews: false,
      successGetDeviceReviews: false,
      error: err.message,
    })
    return null
  }
}
