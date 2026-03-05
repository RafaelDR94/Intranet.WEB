'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Types } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceTypeMap,
  InternalDeviceTypePostMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDeviceType,
  InternalDeviceTypePost,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceTypes } from './fetchDeviceTypes'

/**
 * Create device type.
 */
export const createDeviceType = async (
  set: Set,
  get: Get,
  payload: InternalDeviceTypePost,
): Promise<InternalDeviceType | null> => {
  set({ creatingDeviceType: true, error: undefined, successCreateDeviceType: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(Types, InternalDeviceTypePostMap(payload))
    const raw = res.data?.data ?? res.data ?? null
    const created = raw && typeof raw === 'object' ? InternalDeviceTypeMap(raw) : null

    await fetchDeviceTypes(undefined, set, get, true)

    set({ creatingDeviceType: false, successCreateDeviceType: true })
    return created
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      creatingDeviceType: false,
      successCreateDeviceType: false,
      error: err.message,
    })
    return null
  }
}
