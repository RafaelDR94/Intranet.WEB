'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Brands } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceBrandMap,
  InternalDeviceBrandPutMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDeviceBrand,
  InternalDeviceBrandPut,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceBrands } from './fetchDeviceBrands'

/**
 * Update device brand.
 */
export const updateDeviceBrand = async (
  set: Set,
  get: Get,
  payload: InternalDeviceBrandPut,
): Promise<InternalDeviceBrand | null> => {
  set({ updatingDeviceBrand: true, error: undefined, successUpdateDeviceBrand: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const res: AxiosResponse = await put(Brands, InternalDeviceBrandPutMap(payload))
    const raw = res.data?.data ?? res.data ?? null
    const updated = raw && typeof raw === 'object' ? InternalDeviceBrandMap(raw) : null

    await fetchDeviceBrands(undefined, set, get, true)

    if (updated && get().deviceBrand?.device_brand_id === updated.device_brand_id) {
      set({ deviceBrand: updated })
    }

    set({ updatingDeviceBrand: false, successUpdateDeviceBrand: true })
    return updated
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      updatingDeviceBrand: false,
      successUpdateDeviceBrand: false,
      error: err.message,
    })
    return null
  }
}
