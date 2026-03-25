'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Status } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceStatusMap,
  InternalDeviceStatusPutMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDeviceStatus,
  InternalDeviceStatusPut,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceStatuses } from './fetchDeviceStatuses'

/**
 * Update device status.
 */
export const updateDeviceStatus = async (
  set: Set,
  get: Get,
  payload: InternalDeviceStatusPut,
): Promise<InternalDeviceStatus | null> => {
  set({ updatingDeviceStatus: true, error: undefined, successUpdateDeviceStatus: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const res: AxiosResponse = await put(Status, InternalDeviceStatusPutMap(payload))
    const raw = res.data?.data ?? res.data ?? null
    const updated = raw && typeof raw === 'object' ? InternalDeviceStatusMap(raw) : null

    await fetchDeviceStatuses(true, set, get, true)

    if (updated && get().deviceStatus?.device_status_id === updated.device_status_id) {
      set({ deviceStatus: updated })
    }

    set({ updatingDeviceStatus: false, successUpdateDeviceStatus: true })
    return updated
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      updatingDeviceStatus: false,
      successUpdateDeviceStatus: false,
      error: err.message,
    })
    return null
  }
}
