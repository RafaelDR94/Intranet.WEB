import type { BillingDocumentRequisition, Requisition } from '@/app/mappings/requisitions/requisitions.types'

/**
 * Representa una requisición con la información de empleado incluida en la respuesta.
 */
export type BillingRequisitionWithEmployees = Requisition

/**
 * Documentos vinculados a la requisición de facturación.
 */
export type BillingDocumentWithEmployees = BillingDocumentRequisition
