import { RequisitionMap } from '@/app/mappings/requisitions/requisitions.mapp'
import type { BillingRequisitionWithEmployees } from './billingRequisitionWithEmployees.types'

/**
 * Mapea una respuesta de BillingRequisitionWithEmployees al shape usado en la UI.
 */
export const BillingRequisitionWithEmployeesMap = (
  raw: unknown,
): BillingRequisitionWithEmployees => RequisitionMap(raw)

/**
 * Mapea una colección cruda a una lista tipada de requisiciones con empleados.
 */
export const BillingRequisitionsWithEmployeesMap = (
  list: unknown[],
): BillingRequisitionWithEmployees[] =>
  Array.isArray(list) ? list.map(BillingRequisitionWithEmployeesMap) : []
