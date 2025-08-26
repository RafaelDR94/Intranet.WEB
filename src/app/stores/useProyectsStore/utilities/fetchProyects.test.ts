import { describe, it, expect, vi } from 'vitest'
import { fetchProyects } from './fetchProyects'
import type { ProyectsState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ id: 'p1' }] } }) }))
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
})
