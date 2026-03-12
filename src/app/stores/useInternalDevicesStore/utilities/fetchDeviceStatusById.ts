'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { DeviceStatusById } from '@/app/configurations/Axios/urls'
import { InternalDeviceStatusMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceStatus } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device status by id.
 */
export const fetchDeviceStatusById = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceStatus | null> => {
  const cached = get().deviceStatus
  if (cached?.device_status_id === id && !force) return cached

  set({
    loadingDeviceStatus: true,
    error: undefined,
    successGetDeviceStatus: false,
  })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(`${DeviceStatusById}/${id}`)
    const payload = res.data?.data ?? res.data ?? {}
    const raw = Array.isArray(payload) ? payload[0] ?? {} : payload
    const mapped = InternalDeviceStatusMap(raw)

    set({
      deviceStatus: mapped,
      loadingDeviceStatus: false,
      successGetDeviceStatus: true,
    })

    return mapped
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceStatus: false,
      successGetDeviceStatus: false,
      error: err.message,
    })
    return null
  }
}
