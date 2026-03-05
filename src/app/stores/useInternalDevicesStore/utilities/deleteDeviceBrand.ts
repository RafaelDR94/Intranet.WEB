'use client'

import type { Get, Set } from '../types'

import { Brands } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceBrands } from './fetchDeviceBrands'

/**
 * Delete device brand.
 */
export const deleteDeviceBrand = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({ deletingDeviceBrand: true, error: undefined, successDeleteDeviceBrand: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    await del(`${Brands}/${id}`)

    await fetchDeviceBrands(undefined, set, get, true)

    if (get().deviceBrand?.device_brand_id === id) {
      set({ deviceBrand: undefined })
    }

    set({ deletingDeviceBrand: false, successDeleteDeviceBrand: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      deletingDeviceBrand: false,
      successDeleteDeviceBrand: false,
      error: err.message,
    })
    return false
  }
}
