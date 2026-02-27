import { BenefitMap } from '@/app/mappings/requisitions/requisitions.mapp'
import type { BillingRequisitionWithEmployees } from './billingRequisitionWithEmployees.types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toStringSafe = (value: unknown, fallback = ''): string =>
  value == null ? fallback : String(value)

/**
 * Mapea una respuesta de BillingRequisitionWithEmployees al shape usado en la UI.
 */
export const BillingRequisitionWithEmployeesMap = (
  raw: unknown,
): BillingRequisitionWithEmployees => {
  const base = BenefitMap(raw)
  const record = isRecord(raw) ? raw : {}
  const idRequisition = toStringSafe(
    record.id_requisition ??
      record.requisition_id ??
      record.billingrequisition_id ??
      record.idRequisition ??
      record.id,
  )

  return {
    ...base,
    id_requisition: idRequisition,
  }
}

/**
 * Mapea una colección cruda a una lista tipada de requisiciones con empleados.
 */
export const BillingRequisitionsWithEmployeesMap = (
  list: unknown[],
): BillingRequisitionWithEmployees[] =>
  Array.isArray(list) ? list.map(BillingRequisitionWithEmployeesMap) : []
