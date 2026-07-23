'use client'

import type { Get, Set } from '../types'

import { Assigment } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchDeviceAssignments } from './fetchDeviceAssignments'
import { fetchInternalDevices } from './fetchInternalDevices'

/**
 * Delete device assignment.
 */
export const deleteDeviceAssignment = async (
  set: Set,
  get: Get,
  id: string,
  lowMotive?: string,
  idUser?: string,
): Promise<boolean> => {
  set({
    deletingDeviceAssignment: true,
    error: undefined,
    successDeleteDeviceAssignment: false,
  })

  try {
    const params = new URLSearchParams()
    if (lowMotive) params.set('lowMotive', lowMotive)
    if (idUser) params.set('iduser', idUser)
    const query = params.toString()
    const url = query
      ? `${Assigment}/${id}?${query}`
      : `${Assigment}/${id}`

    const del = pDelete(requireGateway('del'), [200, 204])
    await del(url)

    // Both assignment and inventory views consume this store. Refresh them
    // together so an unassigned device immediately changes status everywhere.
    await Promise.all([
      fetchDeviceAssignments(set, get, true),
      fetchInternalDevices(set, get, true),
    ])

    if (get().deviceAssignment?.device_assigment_id === id) {
      set({ deviceAssignment: undefined })
    }

    set({ deletingDeviceAssignment: false, successDeleteDeviceAssignment: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      deletingDeviceAssignment: false,
      successDeleteDeviceAssignment: false,
      error: err.message,
    })
    return false
  }
}
