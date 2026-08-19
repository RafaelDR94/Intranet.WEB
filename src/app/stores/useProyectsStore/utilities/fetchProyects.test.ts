import { describe, it, expect, vi } from 'vitest'

import type { ProyectsState, Set, Get } from '../types'

import { fetchProyects } from './fetchProyects'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
const pGetMock = vi.fn(async () => ({ data: { data: [{ id: 'p1' }] } }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => pGetMock }))
vi.mock('@/app/mappings/proyects/proyects.mapper', () => ({ ProyectsMap: (d: unknown[]) => d }))

describe('fetchProyects util', () => {
  it('puebla proyectos y apaga loading', async () => {
    const state: Partial<ProyectsState> = { proyects: [], loading: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as ProyectsState) : partial)
    const get: Get = () => state as ProyectsState

    await fetchProyects(set, get)

    expect(state.proyects).toHaveLength(1)
    expect(state.loading).toBe(false)
  })

  it('agrega idEmployee al query cuando se proporciona', async () => {
    const state: Partial<ProyectsState> = { proyects: [], loading: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as ProyectsState) : partial)
    const get: Get = () => state as ProyectsState

    await fetchProyects(set, get, true, 'emp-10')

    expect(pGetMock).toHaveBeenCalledWith('/Reports/Proyects/ByIdEmployee/emp-10?IsActive=true')
  })
})
