'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { Assigment } from '@/app/configurations/Axios/urls'
import { InternalDeviceAssignmentsMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceAssignment } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device assignments.
 */
export const fetchDeviceAssignments = async (
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceAssignment[] | null> => {
  if (!force && get().deviceAssignments.length > 0) return get().deviceAssignments

  set({
    loadingDeviceAssignments: true,
    error: undefined,
    successGetDeviceAssignments: false,
  })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(Assigment)
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDeviceAssignmentsMap(Array.isArray(payload) ? payload : [])

    set({
      deviceAssignments: list,
      loadingDeviceAssignments: false,
      successGetDeviceAssignments: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceAssignments: false,
      successGetDeviceAssignments: false,
      error: err.message,
    })
    return null
  }
}
