'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Devices } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceMap,
  InternalDevicePutMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDevice,
  InternalDevicePut,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchInternalDevices } from './fetchInternalDevices'

/**
 * Update internal device.
 */
export const updateInternalDevice = async (
  set: Set,
  get: Get,
  payload: InternalDevicePut,
): Promise<InternalDevice | null> => {
  set({ updatingDevice: true, error: undefined, successUpdateDevice: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const res: AxiosResponse = await put(Devices, InternalDevicePutMap(payload))
    const raw = res.data?.data ?? res.data ?? null
    const updated =
      raw && typeof raw === 'object' ? InternalDeviceMap(raw) : null

    await fetchInternalDevices(set, get, true)

    if (updated && get().device?.device_id === updated.device_id) {
      set({ device: updated })
    }

    set({ updatingDevice: false, successUpdateDevice: true })
    return updated
  } catch (error) {
    const err = normalizeApiError(error)
    set({ updatingDevice: false, successUpdateDevice: false, error: err.message })
    return null
  }
}
