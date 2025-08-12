import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Set } from './types'

vi.mock('./utilities/fetchProyects', () => ({
  fetchProyects: vi.fn(async (set: Set) => {
    set({ proyects: [{ id: 'p1' }], loading: false })
  })
}))

import { useProyectsStore } from './useProyectsStore'

describe('useProyectsStore', () => {
  beforeEach(() => {
    useProyectsStore.setState({ proyects: [], loading: false, error: undefined })
  })

  it('comienza sin proyectos', () => {
    expect(useProyectsStore.getState().proyects).toEqual([])
  })

  it('fetchProyects carga proyectos', async () => {
    await useProyectsStore.getState().fetchProyects()
    expect(useProyectsStore.getState().proyects).toEqual([{ id: 'p1' }])
  })
})
