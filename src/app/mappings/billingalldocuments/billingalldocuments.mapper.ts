import { mapAuthorization } from "../authorizations/authorizations.mapper"
import { BillingDocumentFullMap, BillingDocumentMap } from "../billingdocuments/billingdocuments.mapper"
import { RequisitionMap } from "../requisitions/requisitions.mapp"
import type {
  BillingAllDocumentsByEmployee,
  BillingAllDocumentsByRequisition,
} from "./billingalldocuments.types"

/**
 * BillingAllDocumentsByEmployeeMap
 * Mapea un registro crudo de la API a un objeto tipado BillingAllDocumentsByEmployee.
 */
export const BillingAllDocumentsByEmployeeMap = (
  raw: unknown,
): BillingAllDocumentsByEmployee => BillingDocumentMap(raw)

/**
 * BillingAllDocumentsByEmployeeListMap
 * Mapea una coleccion cruda de la API a un arreglo tipado.
 */
export const BillingAllDocumentsByEmployeeListMap = (
  list: unknown[],
): BillingAllDocumentsByEmployee[] =>
  Array.isArray(list) ? list.map(BillingAllDocumentsByEmployeeMap) : []

/**
 * BillingAllDocumentsByRequisitionMap
 * Mapea un registro crudo de la API a un objeto tipado BillingAllDocumentsByRequisition.
 */
export const BillingAllDocumentsByRequisitionMap = (
  raw: unknown,
): BillingAllDocumentsByRequisition => {
  const record = raw as Record<string, unknown> | null
  const base = BillingDocumentFullMap(record ?? {})

  return {
    ...base,
    requisition: RequisitionMap(record?.requisition ?? record?.Requisition ?? {}),
    authorization: record?.authorization
      ? mapAuthorization(record.authorization)
      : null,
  }
}

/**
 * BillingAllDocumentsByRequisitionListMap
 * Mapea una coleccion cruda de la API a un arreglo tipado.
 */
export const BillingAllDocumentsByRequisitionListMap = (
  list: unknown[],
): BillingAllDocumentsByRequisition[] =>
  Array.isArray(list) ? list.map(BillingAllDocumentsByRequisitionMap) : []
