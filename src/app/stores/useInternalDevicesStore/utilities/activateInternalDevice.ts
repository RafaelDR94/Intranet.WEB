'use client'

import type { Get, Set } from '../types'

import { ActivateDevice } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchInternalDevices } from './fetchInternalDevices'

/**
 * Activate/deactivate internal device.
 */
export const activateInternalDevice = async (
  set: Set,
  get: Get,
  id: string,
): Promise<boolean> => {
  set({ activatingDevice: true, error: undefined, successActivateDevice: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    await put(`${ActivateDevice}/${id}`, {})

    await fetchInternalDevices(set, get, true)

    set({ activatingDevice: false, successActivateDevice: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      activatingDevice: false,
      successActivateDevice: false,
      error: err.message,
    })
    return false
  }
}
