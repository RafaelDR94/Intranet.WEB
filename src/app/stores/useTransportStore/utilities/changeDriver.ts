'use client'

import type { ChangeDriverPayload, GetState, SetState } from '../types'

import { fetchAssignments } from './fetchAssignments'

import { TransportChangeDriver as TransportChangeDriverUrl } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const changeDriver = async (
  set: SetState,
  get: GetState,
  payload: ChangeDriverPayload
): Promise<boolean> => {
  set({
    changingDriver: true,
    error: undefined,
    warning: undefined,
    successChangeDriver: false,
  })

  try {
    const post = pPost(requireGateway('post'), [200, 204])
    await post(TransportChangeDriverUrl, payload)

    await fetchAssignments(set, get, true)

    const updated = get().assignments.find(
      (a) => a.vehicleassignments_id === payload.id_vehicleAssignments
    )
    if (updated) {
      set({ currentAssignment: updated })
    }

    set({
      changingDriver: false,
      successChangeDriver: true,
    })

    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      changingDriver: false,
      successChangeDriver: false,
      error: err.message,
    })
    return false
  }
}
