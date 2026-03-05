'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { DeviceReviewByDeviceId } from '@/app/configurations/Axios/urls'
import { InternalDeviceReviewsMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceReview } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device reviews by device id.
 */
export const fetchDeviceReviewsByDeviceId = async (
  deviceId: string,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceReview[] | null> => {
  if (!force && get().lastReviewDeviceId === deviceId && get().deviceReviewsByDevice.length > 0) {
    return get().deviceReviewsByDevice
  }

  set({
    loadingDeviceReviewsByDevice: true,
    error: undefined,
    successGetDeviceReviewsByDevice: false,
  })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(`${DeviceReviewByDeviceId}/${deviceId}`)
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDeviceReviewsMap(Array.isArray(payload) ? payload : [])

    set({
      deviceReviewsByDevice: list,
      lastReviewDeviceId: deviceId,
      loadingDeviceReviewsByDevice: false,
      successGetDeviceReviewsByDevice: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceReviewsByDevice: false,
      successGetDeviceReviewsByDevice: false,
      error: err.message,
    })
    return null
  }
}
