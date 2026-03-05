'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Assigment } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceAssignmentMap,
  InternalDeviceAssignmentPutMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  InternalDeviceAssignment,
  InternalDeviceAssignmentPut,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceAssignments } from './fetchDeviceAssignments'

/**
 * Update device assignment.
 */
export const updateDeviceAssignment = async (
  set: Set,
  get: Get,
  payload: InternalDeviceAssignmentPut,
): Promise<InternalDeviceAssignment | null> => {
  set({
    updatingDeviceAssignment: true,
    error: undefined,
    successUpdateDeviceAssignment: false,
  })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const res: AxiosResponse = await put(
      Assigment,
      InternalDeviceAssignmentPutMap(payload),
    )
    const raw = res.data?.data ?? res.data ?? null
    const updated =
      raw && typeof raw === 'object' ? InternalDeviceAssignmentMap(raw) : null

    await fetchDeviceAssignments(set, get, true)

    if (
      updated &&
      get().deviceAssignment?.device_assigment_id ===
        updated.device_assigment_id
    ) {
      set({ deviceAssignment: updated })
    }

    set({ updatingDeviceAssignment: false, successUpdateDeviceAssignment: true })
    return updated
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      updatingDeviceAssignment: false,
      successUpdateDeviceAssignment: false,
      error: err.message,
    })
    return null
  }
}
