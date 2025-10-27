import type { DepartmentType } from '@/app/mappings/department/department.types'

export type DepartmentsState = {
  departments: DepartmentType[]
  loading: boolean
  successGet: boolean
  error?: string
  fetchDepartments: (force?: boolean) => Promise<void>
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial: Partial<DepartmentsState> | ((state: DepartmentsState) => Partial<DepartmentsState>),
) => void

export type Get = () => DepartmentsState
