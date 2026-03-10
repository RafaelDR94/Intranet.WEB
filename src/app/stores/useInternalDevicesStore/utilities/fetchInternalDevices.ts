'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { AllDevices } from '@/app/configurations/Axios/urls'
import { InternalDevicesMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch all internal devices.
 */
export const fetchInternalDevices = async (
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDevice[] | null> => {
  if (!force && get().devices.length > 0) return get().devices

  set({ loadingDevices: true, error: undefined, successGetDevices: false })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(AllDevices)
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDevicesMap(Array.isArray(payload) ? payload : [])

    set({
      devices: list,
      loadingDevices: false,
      successGetDevices: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({ loadingDevices: false, successGetDevices: false, error: err.message })
    return null
  }
}
