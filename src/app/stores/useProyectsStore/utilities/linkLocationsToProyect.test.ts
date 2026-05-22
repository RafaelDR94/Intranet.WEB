import { describe, expect, it, vi } from 'vitest'

import type { Get, ProyectsState, Set } from '../types'

import { linkLocationsToProyect } from './linkLocationsToProyect'

import type { LinkProyectLocationsPayload } from '@/app/mappings/proyects/proyects.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
const postMock = vi.fn(async () => ({ data: { data: true } }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => postMock }))

describe('linkLocationsToProyect util', () => {
  it('llama al endpoint y marca successLinkLocations', async () => {
    const state: Partial<ProyectsState> = {
      linkingLocations: false,
      successLinkLocations: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as ProyectsState) : partial,
      )
    const get: Get = () => state as ProyectsState

    const payload: LinkProyectLocationsPayload = {
      proyect_id: 'project-1',
      location_ids: ['location-1', ' location-2 '],
    }

    const result = await linkLocationsToProyect(set, get, payload)

    expect(result).toBe(true)
    expect(postMock).toHaveBeenCalledWith('/Reports/ProyectLocation/ByProyect', {
      proyect_id: 'project-1',
      location_ids: ['location-1', 'location-2'],
    })
    expect(state.linkingLocations).toBe(false)
    expect(state.successLinkLocations).toBe(true)
  })
})
