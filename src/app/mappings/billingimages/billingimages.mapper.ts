// src/app/mappings/billing/billing.mapper.ts
import {
  BillingImages,
  BillingImagesTable,
  BillingPost,
  BillingPut,
} from './billingimages.types'

/**
 * BillingImageMap
 * Mapea un registro crudo de la API a un objeto tipado BillingImages.
 */
export const BillingImageMap = (raw: any): BillingImages => ({
  billing_image_id: String(raw?.billing_image_id ?? ''),
  requisition: raw?.requisition,
  status: String(raw?.status ?? ''),
  Image: String(raw?.Image ?? ''),
  comments: String(raw?.comments ?? ''),
  dateCreate: String(raw?.date_created ?? ''),
})

/**
 * BillingImagesMap
 * Mapea una colección cruda de la API a un arreglo tipado.
 */
export const BillingImagesMap = (list: any[]): BillingImages[] =>
  Array.isArray(list) ? list.map(BillingImageMap) : []

/**
 * BillingPostMap
 * Construye el payload para crear un registro de imagen de facturación (POST).
 */
export const BillingPostMap = (src: Partial<BillingPost> | any): BillingPost => ({
  requisition_id: String(src?.requisition_id ?? ''),
  Image: String(src?.Image ?? false),
})

/**
 * BillingPutMap
 * Construye el payload para actualizar un registro de imagen de facturación (PUT).
 */
export const BillingPutMap = (src: Partial<BillingPut> | any): BillingPut => ({
  billing_image_id: String(src?.billing_image_id ?? ''),
  requisition_id: String(src?.requisition_id ?? ''),
  Image: String(src?.Image ?? ''),
  comments: String(src?.comments ?? ''),
})
export const BillingImagesTableMap = (src: BillingImages[]): BillingImagesTable[] => {
  return src.map(item => ({
    id: item.billing_image_id,
    billing_image_id: item.billing_image_id,
    deudor: item?.requisition?.employeename,
    proyect: item?.requisition?.projectname,
    Image: item?.Image,
    comments: item?.comments,
    dateCreate: item?.dateCreate,
    requisition_id:item?.requisition?.billingrequisition_id || '',
  }))
}