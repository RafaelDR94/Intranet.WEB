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

  it('setCurrentProyect y clearCurrentProyect funcionan', () => {
    const sample: any = { id: '1', name: 'N', proyectKey: 'K', client: 'C', collaborators: [] }
    useProyectsStore.getState().setCurrentProyect(sample)
    expect(useProyectsStore.getState().currentProyect).toEqual(sample)
    useProyectsStore.getState().clearCurrentProyect()
    expect(useProyectsStore.getState().currentProyect).toBeNull()
  })

  it('reset y resetFlags limpian estado y flags', () => {
    useProyectsStore.setState({
      proyects: [{ id: '1' } as any],
      currentProyect: { id: '1' } as any,
      loading: true,
      creating: true,
      updating: true,
      removing: true,
      successGet: true,
      successPost: true,
      successPut: true,
      successDelete: true,
      error: 'x',
    } as any)

    useProyectsStore.getState().resetFlags()
    const s1 = useProyectsStore.getState()
    expect(s1.loading || s1.creating || s1.updating || s1.removing).toBe(false)
    expect(s1.successGet || s1.successPost || s1.successPut || s1.successDelete).toBe(false)
    expect(s1.error).toBeUndefined()

    useProyectsStore.getState().reset()
    const s2 = useProyectsStore.getState()
    expect(s2.proyects).toEqual([])
    expect(s2.currentProyect).toBeNull()
  })
})
