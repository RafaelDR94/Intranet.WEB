import { describe, it, expect, vi } from 'vitest'

import type { ProyectsState, Set, Get } from '../types'

import { deleteProyect } from './deleteProyect'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pDelete: () => async () => ({ data: {} }) }))

describe('deleteProyect util', () => {
  it('marca successDelete, limpia removing y filtra lista', async () => {
    const state: Partial<ProyectsState> = {
      proyects: [{ id: 'a', name: 'A', proyectKey: 'K', client: 'C', collaborators: [] } as any],
      removing: false,
      successDelete: false,
    }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as ProyectsState) : partial)
    const get: Get = () => state as ProyectsState

    const ok = await deleteProyect(set, get, 'a')

    expect(ok).toBe(true)
    expect(state.removing).toBe(false)
    expect(state.successDelete).toBe(true)
    expect(state.proyects).toEqual([])
  })
})

