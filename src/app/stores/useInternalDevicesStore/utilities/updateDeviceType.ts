'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Types } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceTypeMap,
  InternalDeviceTypePutMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDeviceType,
  InternalDeviceTypePut,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceTypes } from './fetchDeviceTypes'

/**
 * Update device type.
 */
export const updateDeviceType = async (
  set: Set,
  get: Get,
  payload: InternalDeviceTypePut,
): Promise<InternalDeviceType | null> => {
  set({ updatingDeviceType: true, error: undefined, successUpdateDeviceType: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const res: AxiosResponse = await put(Types, InternalDeviceTypePutMap(payload))
    const raw = res.data?.data ?? res.data ?? null
    const updated = raw && typeof raw === 'object' ? InternalDeviceTypeMap(raw) : null

    await fetchDeviceTypes(undefined, set, get, true)

    if (updated && get().deviceType?.device_type_id === updated.device_type_id) {
      set({ deviceType: updated })
    }

    set({ updatingDeviceType: false, successUpdateDeviceType: true })
    return updated
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      updatingDeviceType: false,
      successUpdateDeviceType: false,
      error: err.message,
    })
    return null
  }
}
