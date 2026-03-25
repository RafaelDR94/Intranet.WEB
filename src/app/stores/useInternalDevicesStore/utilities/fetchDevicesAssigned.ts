'use client'

import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { DevicesAssigned } from '@/app/configurations/Axios/urls'
import {
  InternalDevicesMap,
  normalizeAssignedFilters,
} from '@/app/mappings/internaldevices/internaldevices.mapper'
import type {
  DevicesAssignedFilters,
  InternalDevice,
} from '@/app/mappings/internaldevices/internaldevices.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

const sameFilters = (
  current: DevicesAssignedFilters | null,
  next: DevicesAssignedFilters,
) =>
  (current?.isActive ?? undefined) === (next.isActive ?? undefined) &&
  (current?.isAssigned ?? undefined) === (next.isAssigned ?? undefined) &&
  (current?.isReviewed ?? undefined) === (next.isReviewed ?? undefined)

/**
 * Fetch assigned devices with optional filters.
 */
export const fetchDevicesAssigned = async (
  filters: DevicesAssignedFilters | undefined,
  set: Set,
  get: Get,
  force = false,
): Promise<InternalDevice[] | null> => {
  const normalized = normalizeAssignedFilters(filters)
  const cached = get().devicesAssigned
  if (!force && cached.length > 0 && sameFilters(get().assignedFilters, normalized)) {
    return cached
  }

  set({
    loadingAssignedDevices: true,
    error: undefined,
    successGetAssignedDevices: false,
  })

  try {
    const params = new URLSearchParams()
    if (typeof normalized.isActive === 'boolean') {
      params.set('isActive', String(normalized.isActive))
    }
    if (typeof normalized.isAssigned === 'boolean') {
      params.set('isAssigned', String(normalized.isAssigned))
    }
    if (typeof normalized.isReviewed === 'boolean') {
      params.set('isReviewed', String(normalized.isReviewed))
    }

    const url = params.toString()
      ? `${DevicesAssigned}?${params.toString()}`
      : DevicesAssigned

    const getFn = requireGateway('get')
    const res: AxiosResponse = await pGet(getFn)(url)
    const payload = res.data?.data ?? res.data ?? []
    const list = InternalDevicesMap(Array.isArray(payload) ? payload : [])

    set({
      devicesAssigned: list,
      assignedFilters: normalized,
      loadingAssignedDevices: false,
      successGetAssignedDevices: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingAssignedDevices: false,
      successGetAssignedDevices: false,
      error: err.message,
    })
    return null
  }
}
