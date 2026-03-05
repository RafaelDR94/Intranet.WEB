'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Devices } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceMap,
  InternalDevicePostMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDevice,
  InternalDevicePost,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchInternalDevices } from './fetchInternalDevices'

/**
 * Create internal device.
 */
export const createInternalDevice = async (
  set: Set,
  get: Get,
  payload: InternalDevicePost,
): Promise<InternalDevice | null> => {
  set({ creatingDevice: true, error: undefined, successCreateDevice: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(Devices, InternalDevicePostMap(payload))
    const raw = res.data?.data ?? res.data ?? null
    const created =
      raw && typeof raw === 'object' ? InternalDeviceMap(raw) : null

    await fetchInternalDevices(set, get, true)

    set({ creatingDevice: false, successCreateDevice: true })
    return created
  } catch (error) {
    const err = normalizeApiError(error)
    set({ creatingDevice: false, successCreateDevice: false, error: err.message })
    return null
  }
}
