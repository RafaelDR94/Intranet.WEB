// src/app/stores/employees/types.ts
import type { EmployeeType } from '@/app/mappings/employees/employee.types'

export type EmployeesState = {
  employees: EmployeeType[]
  loading: boolean
  error?: string
  fetchEmployees: (force?: boolean) => Promise<void>
  forceFetchEmployees: () => Promise<void>
  reset: () => void
}

export type Set = (
  partial:
    | Partial<EmployeesState>
    | ((s: EmployeesState) => Partial<EmployeesState>)
) => void

export type Get = () => EmployeesState
