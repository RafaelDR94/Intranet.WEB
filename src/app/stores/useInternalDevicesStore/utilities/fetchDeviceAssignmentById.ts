'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { DeviceAssigmentById } from '@/app/configurations/Axios/urls'
import { InternalDeviceAssignmentMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceAssignment } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device assignment by id.
 */
export const fetchDeviceAssignmentById = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceAssignment | null> => {
  const cached = get().deviceAssignment
  if (cached?.device_assigment_id === id && !force) return cached

  set({
    loadingDeviceAssignment: true,
    error: undefined,
    successGetDeviceAssignment: false,
  })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(`${DeviceAssigmentById}/${id}`)
    const payload = res.data?.data ?? res.data ?? {}
    const raw = Array.isArray(payload) ? payload[0] ?? {} : payload
    const mapped = InternalDeviceAssignmentMap(raw)

    set({
      deviceAssignment: mapped,
      loadingDeviceAssignment: false,
      successGetDeviceAssignment: true,
    })

    return mapped
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceAssignment: false,
      successGetDeviceAssignment: false,
      error: err.message,
    })
    return null
  }
}
