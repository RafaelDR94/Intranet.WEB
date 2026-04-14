import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { DepartmentsState, Set } from './types'

const fetchDepartmentsMock = vi.fn(async (set: Set) => {
  set({
    departments: [
      {
        department_id: 'dep-1',
        name: 'Administracion',
        enterprise_id: 'ent-1',
        enterprice_name: 'Empresa 1',
      },
    ],
    loading: false,
    successGet: true,
  })
})

const createDepartmentMock = vi.fn(async () => null)

vi.mock('./utilities', () => ({
  fetchDepartments: (...args: any[]) => fetchDepartmentsMock(...args),
  createDepartment: (...args: any[]) => createDepartmentMock(...args),
}))

import { useDepartmentsStore } from './useDepartmentsStore'

describe('useDepartmentsStore', () => {
  beforeEach(() => {
    fetchDepartmentsMock.mockClear()
    useDepartmentsStore.setState({
      departments: [],
      loading: false,
      successGet: false,
      creating: false,
      successPost: false,
      error: undefined,
      fetchDepartments: useDepartmentsStore.getState().fetchDepartments,
      createDepartment: useDepartmentsStore.getState().createDepartment,
      reset: useDepartmentsStore.getState().reset,
      resetFlags: useDepartmentsStore.getState().resetFlags,
    } as DepartmentsState)
  })

  it('starts with an empty departments list', () => {
    const state = useDepartmentsStore.getState()
    expect(state.departments).toEqual([])
  })

  it('fetchDepartments loads data', async () => {
    await useDepartmentsStore.getState().fetchDepartments()
    const state = useDepartmentsStore.getState()

    expect(fetchDepartmentsMock).toHaveBeenCalled()
    expect(state.departments).toHaveLength(1)
    expect(state.successGet).toBe(true)
  })

  it('reset clears the state', () => {
    useDepartmentsStore.setState({
      departments: [
        {
          department_id: 'dep-1',
          name: 'Administracion',
          enterprise_id: 'ent-1',
          enterprice_name: 'Empresa 1',
        } as any,
      ],
      loading: true,
      successGet: true,
      creating: true,
      successPost: true,
      error: 'Error',
      fetchDepartments: useDepartmentsStore.getState().fetchDepartments,
      createDepartment: useDepartmentsStore.getState().createDepartment,
      reset: useDepartmentsStore.getState().reset,
      resetFlags: useDepartmentsStore.getState().resetFlags,
    } as DepartmentsState)

    useDepartmentsStore.getState().reset()
    const state = useDepartmentsStore.getState()

    expect(state.departments).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(false)
    expect(state.creating).toBe(false)
    expect(state.successPost).toBe(false)
    expect(state.error).toBeUndefined()
  })
})