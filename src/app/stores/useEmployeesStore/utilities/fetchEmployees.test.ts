import { describe, it, expect, vi } from 'vitest'
import { fetchEmployees } from './fetchEmployees'
import type { EmployeesState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ id: '1' }] } }) }))
vi.mock('@/app/mappings/employees/employee.mapper', () => ({ mapEmployees: (d: unknown[]) => d }))

describe('fetchEmployees util', () => {
  it('debería poblar empleados y limpiar loading', async () => {
    const state: Partial<EmployeesState> = { employees: [], loading: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as EmployeesState) : partial)
    const get: Get = () => state as EmployeesState

    await fetchEmployees(set, get)

    expect(state.employees).toHaveLength(1)
    expect(state.loading).toBe(false)
  })
})
