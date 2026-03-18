'use client'

import type { GetState, SetState } from '../types'

import { fetchAssignments } from './fetchAssignments'

import { TransportVehicleReassignmentApprove as TransportVehicleReassignmentApproveUrl } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import type { VehicleReassignmentApprovePayload } from '../types'

export const vehicleReassignmentApprove = async (
  set: SetState,
  get: GetState,
  payload: VehicleReassignmentApprovePayload
): Promise<boolean> => {
  set({
    approvingVehicleReassignment: true,
    error: undefined,
    warning: undefined,
    successApproveVehicleReassignment: false,
  })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    await put(TransportVehicleReassignmentApproveUrl, payload)

    await fetchAssignments(set, get, true)

    set({
      approvingVehicleReassignment: false,
      successApproveVehicleReassignment: true,
    })

    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      approvingVehicleReassignment: false,
      successApproveVehicleReassignment: false,
      error: err.message,
    })
    return false
  }
}
