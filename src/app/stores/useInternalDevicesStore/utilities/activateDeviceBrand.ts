'use client'

import type { Get, Set } from '../types'

import { ActiveBrand } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceBrands } from './fetchDeviceBrands'

/**
 * Activate/deactivate device brand.
 */
export const activateDeviceBrand = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({ activatingDeviceBrand: true, error: undefined, successActivateDeviceBrand: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    await put(`${ActiveBrand}/${id}`, {})

    await fetchDeviceBrands(undefined, set, get, true)

    set({ activatingDeviceBrand: false, successActivateDeviceBrand: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      activatingDeviceBrand: false,
      successActivateDeviceBrand: false,
      error: err.message,
    })
    return false
  }
}
