'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Reviews } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceReviewMap,
  InternalDeviceReviewPutMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDeviceReview,
  InternalDeviceReviewPut,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceReviews } from './fetchDeviceReviews'
import { fetchDeviceReviewsByDeviceId } from './fetchDeviceReviewsByDeviceId'

/**
 * Update device review.
 */
export const updateDeviceReview = async (
  set: Set,
  get: Get,
  payload: InternalDeviceReviewPut,
): Promise<InternalDeviceReview | null> => {
  set({ updatingDeviceReview: true, error: undefined, successUpdateDeviceReview: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const res: AxiosResponse = await put(Reviews, InternalDeviceReviewPutMap(payload))
    const raw = res.data?.data ?? res.data ?? null
    const updated = raw && typeof raw === 'object' ? InternalDeviceReviewMap(raw) : null

    await fetchDeviceReviews(set, get, true)

    if (payload.device_id) {
      await fetchDeviceReviewsByDeviceId(payload.device_id, set, get, true)
    }

    set({ updatingDeviceReview: false, successUpdateDeviceReview: true })
    return updated
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      updatingDeviceReview: false,
      successUpdateDeviceReview: false,
      error: err.message,
    })
    return null
  }
}
