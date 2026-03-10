'use client'

import type { Get, Set } from '../types'

import { Devices } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import { fetchInternalDevices } from './fetchInternalDevices'

/**
 * Delete internal device.
 */
export const deleteInternalDevice = async (
  set: Set,
  get: Get,
  id: string,
  lowMotive?: string,
  idUser?: string,
): Promise<boolean> => {
  set({ deletingDevice: true, error: undefined, successDeleteDevice: false })

  try {
    const params = new URLSearchParams({ id })
    if (lowMotive) params.set('lowMotive', lowMotive)
    if (idUser) params.set('idUser', idUser)

    const url = `${Devices}?${params.toString()}`
    const del = pDelete(requireGateway('del'), [200, 204])
    await del(url)

    await fetchInternalDevices(set, get, true)

    if (get().device?.device_id === id) {
      set({ device: undefined })
    }

    set({ deletingDevice: false, successDeleteDevice: true })
    return true
  } catch (error) {
    const err = normalizeApiError(error)
    set({ deletingDevice: false, successDeleteDevice: false, error: err.message })
    return false
  }
}
