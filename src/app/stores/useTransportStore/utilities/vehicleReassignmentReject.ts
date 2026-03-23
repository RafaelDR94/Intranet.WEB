'use client'

import type { GetState, SetState } from '../types'

import { fetchAssignments } from './fetchAssignments'

import { TransportVehicleReassignmentReject as TransportVehicleReassignmentRejectUrl } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const vehicleReassignmentReject = async (
  set: SetState,
  get: GetState,
  vehicleReassignment: string,
  comment: string
): Promise<boolean> => {
  set({
    rejectingVehicleReassignment: true,
    error: undefined,
    warning: undefined,
    successRejectVehicleReassignment: false,
  })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const url = `${TransportVehicleReassignmentRejectUrl}?VehicleReassignment=${encodeURIComponent(
      vehicleReassignment
    )}&comment=${encodeURIComponent(comment)}`
    await put(url, {})

    await fetchAssignments(set, get, true)

    set({
      rejectingVehicleReassignment: false,
      successRejectVehicleReassignment: true,
    })

    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      rejectingVehicleReassignment: false,
      successRejectVehicleReassignment: false,
      error: err.message,
    })
    return false
  }
}
