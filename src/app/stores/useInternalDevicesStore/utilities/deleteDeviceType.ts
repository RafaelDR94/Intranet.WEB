'use client'

import type { Get, Set } from '../types'

import { Types } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceTypes } from './fetchDeviceTypes'

/**
 * Delete device type.
 */
export const deleteDeviceType = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({ deletingDeviceType: true, error: undefined, successDeleteDeviceType: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    await del(`${Types}/${id}`)

    await fetchDeviceTypes(undefined, set, get, true)

    if (get().deviceType?.device_type_id === id) {
      set({ deviceType: undefined })
    }

    set({ deletingDeviceType: false, successDeleteDeviceType: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      deletingDeviceType: false,
      successDeleteDeviceType: false,
      error: err.message,
    })
    return false
  }
}
