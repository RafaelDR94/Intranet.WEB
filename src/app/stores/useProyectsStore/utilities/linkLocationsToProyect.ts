'use client'

import type { Get, Set } from '../types'

import { LocationProyectByProyect } from '@/app/configurations/Axios/urls'
import type { LinkProyectLocationsPayload } from '@/app/mappings/proyects/proyects.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

const mapLinkProyectLocationsPayload = (
  payload: LinkProyectLocationsPayload,
): LinkProyectLocationsPayload => ({
  proyect_id: String(payload?.proyect_id ?? '').trim(),
  location_ids: Array.isArray(payload?.location_ids)
    ? payload.location_ids
        .map((locationId) => String(locationId ?? '').trim())
        .filter(Boolean)
    : [],
})

export const linkLocationsToProyect = async (
  set: Set,
  _get: Get,
  payload: LinkProyectLocationsPayload,
): Promise<boolean> => {
  set({ linkingLocations: true, successLinkLocations: false, error: undefined })

  try {
    const post = pPost(requireGateway('post'), [200, 204])
    await post(LocationProyectByProyect, mapLinkProyectLocationsPayload(payload))

    set({ linkingLocations: false, successLinkLocations: true })
    return true
  } catch (error) {
    set({
      linkingLocations: false,
      successLinkLocations: false,
      error: normalizeApiError(error).message,
    })
    return false
  }
}
