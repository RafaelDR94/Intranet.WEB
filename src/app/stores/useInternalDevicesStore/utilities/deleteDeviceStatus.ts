'use client'

import type { Get, Set } from '../types'

import { Status } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceStatuses } from './fetchDeviceStatuses'

/**
 * Delete device status.
 */
export const deleteDeviceStatus = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({ deletingDeviceStatus: true, error: undefined, successDeleteDeviceStatus: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    await del(`${Status}/${id}`)

    await fetchDeviceStatuses(undefined, set, get, true)

    if (get().deviceStatus?.device_status_id === id) {
      set({ deviceStatus: undefined })
    }

    set({ deletingDeviceStatus: false, successDeleteDeviceStatus: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      deletingDeviceStatus: false,
      successDeleteDeviceStatus: false,
      error: err.message,
    })
    return false
  }
}
