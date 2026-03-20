'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Status } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceStatusMap,
  InternalDeviceStatusPostMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDeviceStatus,
  InternalDeviceStatusPost,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceStatuses } from './fetchDeviceStatuses'

/**
 * Create device status.
 */
export const createDeviceStatus = async (
  set: Set,
  get: Get,
  payload: InternalDeviceStatusPost,
): Promise<InternalDeviceStatus | null> => {
  set({ creatingDeviceStatus: true, error: undefined, successCreateDeviceStatus: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(Status, InternalDeviceStatusPostMap(payload))
    const raw = res.data?.data ?? res.data ?? null
    const created = raw && typeof raw === 'object' ? InternalDeviceStatusMap(raw) : null

    await fetchDeviceStatuses(true, set, get, true)

    set({ creatingDeviceStatus: false, successCreateDeviceStatus: true })
    return created
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      creatingDeviceStatus: false,
      successCreateDeviceStatus: false,
      error: err.message,
    })
    return null
  }
}
