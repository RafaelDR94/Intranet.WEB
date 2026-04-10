import type { DepartmentType, DepartmentPost } from '@/app/mappings/department/department.types'

export type DepartmentsState = {
  departments: DepartmentType[]
  loading: boolean
  successGet: boolean
  creating: boolean
  successPost: boolean
  error?: string
  fetchDepartments: (force?: boolean) => Promise<void>
  createDepartment: (payload: DepartmentPost) => Promise<DepartmentType | null>
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial: Partial<DepartmentsState> | ((state: DepartmentsState) => Partial<DepartmentsState>),
) => void

export type Get = () => DepartmentsState
