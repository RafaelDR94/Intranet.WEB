// src/app/mappings/billing/billingdocuments.mapper.ts
import {
  BillingDocuments,
  BillingDocumentsPost,
  BillingDocumentsPut,
} from './billingdocuments.types'

/**
 * BillingDocumentMap
 * Mapea un registro crudo de la API a un objeto tipado BillingDocuments.
 */
export const BillingDocumentMap = (raw: any): BillingDocuments => ({
  billingdocument_id: String(raw?.billingdocument_id ?? ''),
  requisition_id:     String(raw?.requisition_id     ?? ''),
  billingimages_id:   String(raw?.billingimages_id   ?? ''),
  xml:                String(raw?.xml                ?? ''),
  pdf:                String(raw?.pdf                ?? ''),
  status_id:          String(raw?.status_id          ?? ''),
  downloaded:         Boolean(raw?.downloaded ?? false),
  validate:           Boolean(raw?.validate   ?? false),
  comments:           String(raw?.comments           ?? ''),
})

/**
 * BillingDocumentsMap
 * Mapea una colección cruda de la API a un arreglo tipado.
 */
export const BillingDocumentsMap = (list: any[]): BillingDocuments[] =>
  Array.isArray(list) ? list.map(BillingDocumentMap) : []

/**
 * BillingDocumentsPostMap
 * Construye el payload para crear un documento de facturación (POST).
 */
export const BillingDocumentsPostMap = (
  src: Partial<BillingDocumentsPost> | any
): BillingDocumentsPost => ({
  requisition_id:   String(src?.requisition_id   ?? ''),
  billingimages_id: String(src?.billingimages_id ?? ''),
  xml:              String(src?.xml              ?? ''),
  pdf:              String(src?.pdf              ?? ''),
  comments:         String(src?.comments         ?? ''),
})

/**
 * BillingDocumentsPutMap
 * Construye el payload para actualizar un documento de facturación (PUT).
 */
export const BillingDocumentsPutMap = (
  src: Partial<BillingDocumentsPut> | any
): BillingDocumentsPut => ({
  billingdocument_id: String(src?.billingdocument_id ?? ''),
  requisition_id:     String(src?.requisition_id     ?? ''),
  billingimages_id:   String(src?.billingimages_id   ?? ''),
  xml:                String(src?.xml                ?? ''),
  pdf:                String(src?.pdf                ?? ''),
  status_id:          String(src?.status_id          ?? ''),
  downloaded:         Boolean(src?.downloaded ?? false),
  validate:           Boolean(src?.validate   ?? false),
  comments:           String(src?.comments           ?? ''),
})
