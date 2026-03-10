'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Brands } from '@/app/configurations/Axios/urls'
import { InternalDeviceBrandsMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceBrand } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device brands.
 */
export const fetchDeviceBrands = async (
  isActive: boolean | undefined,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceBrand[] | null> => {
  if (!force && get().deviceBrands.length > 0 && typeof isActive !== 'boolean') {
    return get().deviceBrands
  }

  set({
    loadingDeviceBrands: true,
    error: undefined,
    successGetDeviceBrands: false,
  })

  try {
    const params = typeof isActive === 'boolean'
      ? `?isActive=${String(isActive)}`
      : ''
    const url = `${Brands}${params}`

    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(url)
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDeviceBrandsMap(Array.isArray(payload) ? payload : [])

    set({
      deviceBrands: list,
      loadingDeviceBrands: false,
      successGetDeviceBrands: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceBrands: false,
      successGetDeviceBrands: false,
      error: err.message,
    })
    return null
  }
}
