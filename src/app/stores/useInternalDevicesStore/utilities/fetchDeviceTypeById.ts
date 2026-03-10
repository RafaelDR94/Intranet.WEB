'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { DeviceTypeById } from '@/app/configurations/Axios/urls'
import { InternalDeviceTypeMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceType } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device type by id.
 */
export const fetchDeviceTypeById = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceType | null> => {
  const cached = get().deviceType
  if (cached?.device_type_id === id && !force) return cached

  set({
    loadingDeviceType: true,
    error: undefined,
    successGetDeviceType: false,
  })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(`${DeviceTypeById}/${id}`)
    const payload = res.data?.data ?? res.data ?? {}
    const raw = Array.isArray(payload) ? payload[0] ?? {} : payload
    const mapped = InternalDeviceTypeMap(raw)

    set({
      deviceType: mapped,
      loadingDeviceType: false,
      successGetDeviceType: true,
    })

    return mapped
  } catch (error) {
    const err = normalizeApiError(error)
    set({ loadingDeviceType: false, successGetDeviceType: false, error: err.message })
    return null
  }
}
