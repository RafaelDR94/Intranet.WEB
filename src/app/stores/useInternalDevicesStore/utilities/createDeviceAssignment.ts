'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Assigment } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceAssignmentMap,
  InternalDeviceAssignmentPostMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDeviceAssignment,
  InternalDeviceAssignmentPost,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceAssignments } from './fetchDeviceAssignments'

/**
 * Create device assignment.
 */
export const createDeviceAssignment = async (
  set: Set,
  get: Get,
  payload: InternalDeviceAssignmentPost,
): Promise<InternalDeviceAssignment | null> => {
  set({
    creatingDeviceAssignment: true,
    error: undefined,
    successCreateDeviceAssignment: false,
  })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(
      Assigment,
      InternalDeviceAssignmentPostMap(payload),
    )
    const raw = res.data?.data ?? res.data ?? null
    const created =
      raw && typeof raw === 'object' ? InternalDeviceAssignmentMap(raw) : null

    await fetchDeviceAssignments(set, get, true)

    set({ creatingDeviceAssignment: false, successCreateDeviceAssignment: true })
    return created
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      creatingDeviceAssignment: false,
      successCreateDeviceAssignment: false,
      error: err.message,
    })
    return null
  }
}
