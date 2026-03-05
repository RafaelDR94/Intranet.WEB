'use client'

import type { Get, Set } from '../types'

import { ActivateStatus } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceStatuses } from './fetchDeviceStatuses'

/**
 * Activate/deactivate device status.
 */
export const activateDeviceStatus = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({ activatingDeviceStatus: true, error: undefined, successActivateDeviceStatus: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    await put(`${ActivateStatus}/${id}`, {})

    await fetchDeviceStatuses(undefined, set, get, true)

    set({ activatingDeviceStatus: false, successActivateDeviceStatus: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      activatingDeviceStatus: false,
      successActivateDeviceStatus: false,
      error: err.message,
    })
    return false
  }
}
