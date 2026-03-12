'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Reviews } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceReviewMap,
  InternalDeviceReviewPostMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDeviceReview,
  InternalDeviceReviewPost,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceReviews } from './fetchDeviceReviews'
import { fetchDeviceReviewsByDeviceId } from './fetchDeviceReviewsByDeviceId'

/**
 * Create device review.
 */
export const createDeviceReview = async (
  set: Set,
  get: Get,
  payload: InternalDeviceReviewPost,
): Promise<InternalDeviceReview | null> => {
  set({ creatingDeviceReview: true, error: undefined, successCreateDeviceReview: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(Reviews, InternalDeviceReviewPostMap(payload))
    const raw = res.data?.data ?? res.data ?? null
    const created = raw && typeof raw === 'object' ? InternalDeviceReviewMap(raw) : null

    await fetchDeviceReviews(set, get, true)

    if (payload.device_id) {
      await fetchDeviceReviewsByDeviceId(payload.device_id, set, get, true)
    }

    set({ creatingDeviceReview: false, successCreateDeviceReview: true })
    return created
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      creatingDeviceReview: false,
      successCreateDeviceReview: false,
      error: err.message,
    })
    return null
  }
}
