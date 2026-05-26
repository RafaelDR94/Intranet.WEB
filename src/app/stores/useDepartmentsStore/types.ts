import type {
  DepartmentType,
  DepartmentPost,
  DepartmentPut,
} from '@/app/mappings/department/department.types'

export type DepartmentsState = {
  departments: DepartmentType[]
  loading: boolean
  successGet: boolean
  creating: boolean
  successPost: boolean
  updating: boolean
  successPut: boolean
  error?: string
  fetchDepartments: (force?: boolean) => Promise<void>
  createDepartment: (payload: DepartmentPost) => Promise<DepartmentType | null>
  updateDepartment: (payload: DepartmentPut) => Promise<DepartmentType | null>
  deleteDepartment: (id: string) => Promise<boolean>
  reset: () => void
  resetFlags: () => void
}

export type Set = (
  partial: Partial<DepartmentsState> | ((state: DepartmentsState) => Partial<DepartmentsState>),
) => void

export type Get = () => DepartmentsState
