// src/app/stores/employees/utilities/fetchEmployees.ts
import { Employees } from '@/app/configurations/Axios/urls'
import { mapEmployees } from '@/app/mappings/employees/employee.mapper'
import type { EmployeeType } from '@/app/mappings/employees/employee.types'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import type { Set, Get } from '../types'

export const fetchEmployees = async (set: Set, get: Get, force = false) => {
  // cache básica
  if (get().employees.length > 0 && !force) return

  set({ loading: true, error: undefined })
  try {
    const getFn = requireGateway('get') // obtiene el GET del gateway
    const res = await pGet(getFn)(`${Employees}?IsActive=true`)
    const mapped: EmployeeType[] = mapEmployees(res.data?.data ?? [])
    set({ employees: mapped, loading: false })
  } catch (err) {
    const e = normalizeApiError(err)
    set({ error: e.message, loading: false })
  }
}
