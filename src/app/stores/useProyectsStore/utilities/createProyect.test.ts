import { describe, it, expect, vi } from 'vitest'

import type { ProyectsState, Set, Get } from '../types'

import { createProyect } from './createProyect'

import type { ProyectPost } from '@/app/mappings/proyects/proyects.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { data: { id: 'np' } } }) }))
vi.mock('./fetchProyects', () => ({ fetchProyects: vi.fn(async () => {}) }))

describe('createProyect util', () => {
  it('marca successPost y limpia creating', async () => {
    const state: Partial<ProyectsState> = { creating: false, successPost: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as ProyectsState) : partial)
    const get: Get = () => state as ProyectsState

    const payload: ProyectPost = { name: 'N', proyectKey: 'K', client: 'C', collaborators: [] }
    const res = await createProyect(set, get, payload)

    expect(res?.id).toBe('np')
    expect(state.creating).toBe(false)
    expect(state.successPost).toBe(true)
  })
})

