'use client'

import type { Get, Set } from '../types'

import { ActivateType } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceTypes } from './fetchDeviceTypes'

/**
 * Activate/deactivate device type.
 */
export const activateDeviceType = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({ activatingDeviceType: true, error: undefined, successActivateDeviceType: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    await put(`${ActivateType}/${id}`, {})

    await fetchDeviceTypes(undefined, set, get, true)

    set({ activatingDeviceType: false, successActivateDeviceType: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      activatingDeviceType: false,
      successActivateDeviceType: false,
      error: err.message,
    })
    return false
  }
}
