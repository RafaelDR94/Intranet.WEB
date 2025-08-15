// src/app/mappings/billing/billing.mapper.ts
import {
  BillingImages,
  BillingPost,
  BillingPut,
} from './billingimages.types'

/**
 * BillingImageMap
 * Mapea un registro crudo de la API a un objeto tipado BillingImages.
 */
export const BillingImageMap = (raw: any): BillingImages => ({
  billing_image_id: String(raw?.billing_image_id ?? ''),
  requisition_id:   String(raw?.requisition_id   ?? ''),
  status_id:        String(raw?.status_id        ?? ''),
  Image:            String(raw?.Image            ?? ''),
  downloaded:       Boolean(raw?.downloaded ?? false),
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
  Image:          Boolean(src?.Image ?? false),
})

/**
 * BillingPutMap
 * Construye el payload para actualizar un registro de imagen de facturación (PUT).
 */
export const BillingPutMap = (src: Partial<BillingPut> | any): BillingPut => ({
  billing_image_id: String(src?.billing_image_id ?? ''),
  requisition_id:   String(src?.requisition_id   ?? ''),
  status_id:        String(src?.status_id        ?? ''),
  Image:            String(src?.Image            ?? ''),
  downloaded:       Boolean(src?.downloaded ?? false),
})
