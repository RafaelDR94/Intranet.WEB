'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { DeviceBrandById } from '@/app/configurations/Axios/urls'
import { InternalDeviceBrandMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceBrand } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device brand by id.
 */
export const fetchDeviceBrandById = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceBrand | null> => {
  const cached = get().deviceBrand
  if (cached?.device_brand_id === id && !force) return cached

  set({
    loadingDeviceBrand: true,
    error: undefined,
    successGetDeviceBrand: false,
  })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(`${DeviceBrandById}/${id}`)
    const payload = res.data?.data ?? res.data ?? {}
    const raw = Array.isArray(payload) ? payload[0] ?? {} : payload
    const mapped = InternalDeviceBrandMap(raw)

    set({
      deviceBrand: mapped,
      loadingDeviceBrand: false,
      successGetDeviceBrand: true,
    })

    return mapped
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceBrand: false,
      successGetDeviceBrand: false,
      error: err.message,
    })
    return null
  }
}
