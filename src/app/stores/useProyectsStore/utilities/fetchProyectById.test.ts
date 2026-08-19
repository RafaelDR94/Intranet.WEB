import { describe, expect, it, vi } from 'vitest'

import type { Get, ProyectsState, Set } from '../types'

import { fetchProyectById } from './fetchProyectById'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
const pGetMock = vi.fn(async () => ({
  data: {
    data: {
      id: 'proj-1',
      name: 'Proyecto Uno',
      proyectKey: 'PR1',
      client: 'Cliente Uno',
      collaborators: [{ employee_id: 'emp-1', fullname: 'Bruno Mendoza' }],
      manager: { employee_id: 'emp-1', fullname: 'Bruno Mendoza' },
    },
  },
}))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => pGetMock }))
vi.mock('@/app/mappings/proyects/proyects.mapper', () => ({
  ProyectMap: (data: unknown) => data,
}))

describe('fetchProyectById util', () => {
  it('consulta el endpoint por id y guarda currentProyect', async () => {
    const state: Partial<ProyectsState> = { currentProyect: null, loading: false }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as ProyectsState) : partial,
      )
    const get: Get = () => state as ProyectsState

    const result = await fetchProyectById(set, get, 'proj-1')

    expect(pGetMock).toHaveBeenCalledWith('/Reports/Proyects/ById/proj-1')
    expect(result).toEqual(state.currentProyect)
    expect(state.loading).toBe(false)
  })
})
