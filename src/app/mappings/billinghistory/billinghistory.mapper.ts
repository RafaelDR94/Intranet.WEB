import { HistoryRow } from './billinghistory.types'
import { ProyectMap } from '../proyects/proyects.mapper'
import { BillingDocumentCategoryMap, BillingDocumentDescriptionMap } from '../billingdocuments/billingdocuments.mapper'
/**
 * HistoryRowMap
 * Mapea un registro crudo de historial de facturación a un objeto tipado.
 */
export const HistoryRowMap = (raw: any): HistoryRow => ({
  id: String(raw?.id ?? ''),
  billing_image_id: String(raw?.billing_image_id ?? ''),
  billingdocument_id: String(raw?.billingdocument_id ?? ''),
  project: ProyectMap(raw?.project ?? {}),
  requisitionkey: String(raw?.requisitionkey ?? ''),
  status: String(raw?.status ?? 'pendiente') as HistoryRow['status'],
  xml: String(raw?.xml ?? ''),
  pdf: String(raw?.pdf ?? ''),
  image: String(raw?.image ?? ''),
  comments: String(raw?.comments ?? ''),
  dateCreate: String(raw?.dateCreate ?? ''),
  certificationDate: String(raw?.certificationDate ?? ''),
  uuid: String(raw?.uuid ?? ''),
  category: BillingDocumentCategoryMap(raw.category),
  description: BillingDocumentDescriptionMap(raw.description),
  numnights: raw?.numnights,
  numpersons: raw?.numpersons,
})

/**
 * BillingHistoryMap
 * Mapea una colección cruda a un arreglo tipado HistoryRow.
 */
export const BillingHistoryMap = (list: any[]): HistoryRow[] =>
  Array.isArray(list) ? list.map(HistoryRowMap) : []

