// src/app/stores/employees/types.ts
import type { EmployeeType } from '@/app/mappings/employees/employee.types'

/**
 * Shape of the employees store state.
 */
export type EmployeesState = {
  /** Lista de empleados disponibles */
  employees: EmployeeType[]
  /** Indica si se está cargando desde el API */
  loading: boolean
  /** Mensaje de error de la última operación */
  error?: string
  /** Dispara la obtención de empleados del backend */
  fetchEmployees: (force?: boolean) => Promise<void>
  /** Forza el refetch ignorando cache */
  forceFetchEmployees: () => Promise<void>
  /** Limpia el estado */
  reset: () => void
}

export type Set = (
  partial:
    | Partial<EmployeesState>
    | ((s: EmployeesState) => Partial<EmployeesState>)
) => void

export type Get = () => EmployeesState
