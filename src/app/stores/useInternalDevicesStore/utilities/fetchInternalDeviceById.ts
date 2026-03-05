'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { DeviceById } from '@/app/configurations/Axios/urls'
import { InternalDeviceMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch internal device by id.
 */
export const fetchInternalDeviceById = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDevice | null> => {
  const cached = get().device
  if (cached?.device_id === id && !force) return cached

  set({
    loadingDevice: true,
    error: undefined,
    successGetDevice: false,
  })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(`${DeviceById}/${id}`)
    const payload = res.data?.data ?? res.data ?? {}
    const raw = Array.isArray(payload) ? payload[0] ?? {} : payload
    const mapped = InternalDeviceMap(raw)

    const devices = get().devices
    const nextDevices =
      devices.length > 0
        ? devices.map((item) =>
            item.device_id === mapped.device_id ? mapped : item,
          )
        : devices

    set({
      device: mapped,
      devices: nextDevices,
      loadingDevice: false,
      successGetDevice: true,
    })

    return mapped
  } catch (error) {
    const err = normalizeApiError(error)
    set({ loadingDevice: false, successGetDevice: false, error: err.message })
    return null
  }
}
