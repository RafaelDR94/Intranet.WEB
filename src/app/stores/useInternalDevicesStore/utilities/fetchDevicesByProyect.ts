'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { DeviceByIdProyect } from '@/app/configurations/Axios/urls'
import { InternalDevicesMap } from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDevice } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch devices for a project.
 */
export const fetchDevicesByProyect = async (
  proyectId: string,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDevice[] | null> => {
  if (!force && get().lastProyectId === proyectId && get().devicesByProyect.length > 0) {
    return get().devicesByProyect
  }

  set({
    loadingDevicesByProyect: true,
    error: undefined,
    successGetDevicesByProyect: false,
  })

  try {
    const params = new URLSearchParams({ idProyect: proyectId })
    const url = `${DeviceByIdProyect}?${params.toString()}`

    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(url)
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDevicesMap(Array.isArray(payload) ? payload : [])

    set({
      devicesByProyect: list,
      lastProyectId: proyectId,
      loadingDevicesByProyect: false,
      successGetDevicesByProyect: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDevicesByProyect: false,
      successGetDevicesByProyect: false,
      error: err.message,
    })
    return null
  }
}
