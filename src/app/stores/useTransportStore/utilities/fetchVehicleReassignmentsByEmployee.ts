'use client'

import type { AxiosResponse } from 'axios'

import type { SetState } from '../types'

import { TransportVehicleReassignmentByEmployee as TransportVehicleReassignmentByEmployeeUrl } from '@/app/configurations/Axios/urls'
import { transportTransformer } from '@/app/mappings/transport/transformers'
import type { TransportAssignament } from '@/app/mappings/transport/transport.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchVehicleReassignmentsByEmployee = async (
  idEmployee: string,
  set: SetState,
): Promise<TransportAssignament[] | null> => {
  set({
    loadingVehicleReassignmentsByEmployee: true,
    error: undefined,
    warning: undefined,
    successGetVehicleReassignmentsByEmployee: false,
  })

  try {
    const getFn = pGet(requireGateway('get'))
    const res: AxiosResponse = await getFn(
      `${TransportVehicleReassignmentByEmployeeUrl}/${encodeURIComponent(idEmployee)}`
    )
    const raw = res.data?.data ?? res.data ?? []
    const list = transportTransformer.mapTransportAssignaments(
      Array.isArray(raw) ? raw : raw?.items ?? []
    )

    set({
      vehicleReassignmentsByEmployee: list,
      loadingVehicleReassignmentsByEmployee: false,
      successGetVehicleReassignmentsByEmployee: true,
    })

    return list
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      loadingVehicleReassignmentsByEmployee: false,
      successGetVehicleReassignmentsByEmployee: false,
      error: err.message,
    })
    return null
  }
}
