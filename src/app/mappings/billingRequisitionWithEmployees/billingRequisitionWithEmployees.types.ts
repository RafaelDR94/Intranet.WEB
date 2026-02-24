import type { BillingDocumentRequisition, Benefit } from '@/app/mappings/requisitions/requisitions.types'

/**
 * Representa una requisición con la información de empleado incluida en la respuesta.
 */
export type BillingRequisitionWithEmployees = Benefit

/**
 * Documentos vinculados a la requisición de facturación.
 */
export type BillingDocumentWithEmployees = BillingDocumentRequisition
