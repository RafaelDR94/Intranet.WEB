'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { DeviceAssignmentHistoryByDeviceId } from '@/app/configurations/Axios/urls'
import {
  InternalDeviceAssignmentsHistoryMap,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type { InternalDeviceAssignmentHistory } from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Fetch device assignment history by device id.
 */
export const fetchDeviceAssignmentHistoryByDeviceId = async (
  deviceId: string,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDeviceAssignmentHistory[] | null> => {
  if (
    !force &&
    get().lastAssignmentHistoryDeviceId === deviceId &&
    get().deviceAssignmentHistory.length > 0
  ) {
    return get().deviceAssignmentHistory
  }

  set({
    loadingDeviceAssignmentHistory: true,
    error: undefined,
    successGetDeviceAssignmentHistory: false,
  })

  try {
    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(
      `${DeviceAssignmentHistoryByDeviceId}/${deviceId}`,
    )
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDeviceAssignmentsHistoryMap(
      Array.isArray(payload) ? payload : [],
    )

    set({
      deviceAssignmentHistory: list,
      lastAssignmentHistoryDeviceId: deviceId,
      loadingDeviceAssignmentHistory: false,
      successGetDeviceAssignmentHistory: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingDeviceAssignmentHistory: false,
      successGetDeviceAssignmentHistory: false,
      error: err.message,
    })
    return null
  }
}
