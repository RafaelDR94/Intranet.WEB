import { describe, it, expect, vi } from 'vitest'

import type { ProyectsState, Set, Get } from '../types'

import { updateProyect } from './updateProyect'

import type { ProyectPut } from '@/app/mappings/proyects/proyects.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
const putMock = vi.fn(async () => ({ data: { data: { id: 'up' } } }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => putMock }))
vi.mock('./fetchProyects', () => ({ fetchProyects: vi.fn(async () => {}) }))

describe('updateProyect util', () => {
  it('marca successPut y limpia updating', async () => {
    const state: Partial<ProyectsState> = { updating: false, successPut: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as ProyectsState) : partial)
    const get: Get = () => state as ProyectsState

    const payload: ProyectPut = { id: '1', name: 'N', proyectKey: 'K', client: 'C', managerId: null, collaborators: ['emp-1', 'emp-2'] }
    const res = await updateProyect(set, get, payload)

    expect(res?.id).toBe('up')
    expect(putMock).toHaveBeenCalledWith('/Reports/Proyects', {
      id: '1',
      name: 'N',
      proyectkey: 'K',
      proyectKey: 'K',
      client: 'C',
      collaborators_ids: ['emp-1', 'emp-2'],
      collabarators_ids: ['emp-1', 'emp-2'],
      managerId: null,
    })
    expect(state.updating).toBe(false)
    expect(state.successPut).toBe(true)
  })
})

