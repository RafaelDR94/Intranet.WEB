'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Types } from '@/app/configurations/Axios/urls'
import { InternalDeviceTypesMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceType } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device types.
 */
export const fetchDeviceTypes = async (
  isActive: boolean | undefined,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceType[] | null> => {
  if (!force && get().deviceTypes.length > 0 && typeof isActive !== 'boolean') {
    return get().deviceTypes
  }

  set({
    loadingDeviceTypes: true,
    error: undefined,
    successGetDeviceTypes: false,
  })

  try {
    const params = typeof isActive === 'boolean'
      ? `?isActive=${String(isActive)}`
      : ''
    const url = `${Types}${params}`

    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(url)
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDeviceTypesMap(Array.isArray(payload) ? payload : [])

    set({
      deviceTypes: list,
      loadingDeviceTypes: false,
      successGetDeviceTypes: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceTypes: false,
      successGetDeviceTypes: false,
      error: err.message,
    })
    return null
  }
}
