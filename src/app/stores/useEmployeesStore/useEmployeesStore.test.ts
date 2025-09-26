import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { Set } from './types'

// mock utility
vi.mock('./utilities/fetchEmployees', () => ({
  fetchEmployees: vi.fn(async (set: Set) => {
    set({ employees: [{ id: '1' }], loading: false })
  })
}))

import { useEmployeesStore } from './useEmployeesStore'

describe('useEmployeesStore', () => {
  beforeEach(() => {
    useEmployeesStore.setState({ employees: [], loading: false, error: undefined })
  })

  it('debería iniciar vacío', () => {
    expect(useEmployeesStore.getState().employees).toEqual([])
  })

  it('fetchEmployees actualiza empleados', async () => {
    await useEmployeesStore.getState().fetchEmployees()
    expect(useEmployeesStore.getState().employees).toEqual([{ id: '1' }])
  })
})
