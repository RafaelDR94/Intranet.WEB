import { describe, it, expect, vi } from 'vitest'

import type { ProyectsState, Set, Get } from '../types'

import { updateProyect } from './updateProyect'

import type { ProyectPut } from '@/app/mappings/proyects/proyects.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({ data: { data: { id: 'up' } } }) }))
vi.mock('./fetchProyects', () => ({ fetchProyects: vi.fn(async () => {}) }))

describe('updateProyect util', () => {
  it('marca successPut y limpia updating', async () => {
    const state: Partial<ProyectsState> = { updating: false, successPut: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as ProyectsState) : partial)
    const get: Get = () => state as ProyectsState

    const payload: ProyectPut = { id: '1', name: 'N', proyectKey: 'K', client: 'C', collaborators: [] }
    const res = await updateProyect(set, get, payload)

    expect(res?.id).toBe('up')
    expect(state.updating).toBe(false)
    expect(state.successPut).toBe(true)
  })
})

