'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Status } from '@/app/configurations/Axios/urls'
import { InternalDeviceStatusesMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceStatus } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device statuses.
 */
export const fetchDeviceStatuses = async (
  _isActive: boolean | undefined,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceStatus[] | null> => {
  if (!force && get().deviceStatuses.length > 0) {
    return get().deviceStatuses
  }

  set({
    loadingDeviceStatuses: true,
    error: undefined,
    successGetDeviceStatuses: false,
  })

  try {
    const url = `${Status}?isActive=true`

    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(url)
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDeviceStatusesMap(Array.isArray(payload) ? payload : [])

    set({
      deviceStatuses: list,
      loadingDeviceStatuses: false,
      successGetDeviceStatuses: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceStatuses: false,
      successGetDeviceStatuses: false,
      error: err.message,
    })
    return null
  }
}
