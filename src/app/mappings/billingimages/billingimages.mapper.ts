// src/app/mappings/billing/billing.mapper.ts
import { BillingDocumentCategoryMap, BillingDocumentDescriptionMap } from '../billingdocuments/billingdocuments.mapper'
import { RequisitionMap } from '../requisitions/requisitions.mapp'

import {
  BillingImages,
  BillingImagesTable,
  BillingPost,
  BillingPut,
} from './billingimages.types'

const normalizeImageUrls = (rawImages: unknown): string[] => {
  if (Array.isArray(rawImages)) {
    return rawImages
      .map((img) => {
        if (typeof img === 'string') return img
        if (img && typeof (img as any).image === 'string') return String((img as any).image)
        return ''
      })
      .filter((img) => Boolean(img))
  }
  if (typeof rawImages === 'string') return rawImages ? [rawImages] : []
  return []
}
/**
 * BillingImageMap
 * Mapea un registro crudo de la API a un objeto tipado BillingImages.
 */
export const BillingImageMap = (raw: any): BillingImages => ({
  billing_image_id: String(raw?.billing_image_id ?? ''),
  requisition: RequisitionMap(raw?.requisition),
  status: String(raw?.status ?? ''),
  images: normalizeImageUrls(raw?.images),
  comments: String(raw?.comments ?? ''),
  user_comments: String(raw?.user_comments ?? ''),
  dateCreate: String(raw?.date_created ?? ''),
  category: BillingDocumentCategoryMap(raw?.Category),
  description: BillingDocumentDescriptionMap(raw?.description),
  numpersons: Number(raw?.numpersons),
  numnights: Number(raw?.numnights)
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
  ...(src?.requisition_id ? { requisition_id: String(src.requisition_id) } : {}),
  images: Array.isArray(src?.images) ? src.images : src?.images ? [src.images] : [],
  description: String(src?.description ?? ''),
  numpersons: String(src?.numpersons ?? 0),
  numnights: String(src?.numnights ?? 0),
  category_id: src?.category_id
})

/**
 * BillingPutMap
 * Construye el payload para actualizar un registro de imagen de facturación (PUT).
 */
export const BillingPutMap = (src: Partial<BillingPut> | any): BillingPut => ({
  billing_image_id: src?.billing_image_id ?? '',
  requisition_id: String(src?.requisition_id ?? ''),
  images: Array.isArray(src?.images) ? src.images : src?.images ? [src.images] : [],
  comments: String(src?.comments ?? ''),
  user_comments: String(src?.user_comments ?? ''),
  description: String(src?.description ?? ''),
  numpersons: String(src?.numpersons ?? 0),
  numnights: String(src?.numnights ?? 0),
  category_id: String(src?.category_id)

})
export const BillingImagesTableMap = (src: BillingImages[]): BillingImagesTable[] => {
  return src.map(item => {
    const imageUrls = Array.isArray(item?.images) ? item.images : []
    return {
      id: item.billing_image_id,
      billing_image_id: item.billing_image_id,
      deudor: item?.requisition?.employeename,
      proyect: item?.requisition?.projectname,
      images: imageUrls,
      Image: imageUrls[0] ?? '',
      comments: item?.comments,
      dateCreate: item?.dateCreate,
      requisition_id: item?.requisition?.billingrequisition_id || '',
      category: item?.category,
      description: item?.description,
      numpersons: item?.numpersons,
      numnights: item?.numnights,
      requisitionkey: item?.requisition?.requisitionkey,
      categoryName: item?.category?.name,
      descriptionName:  item?.description?.name,
    }
  })
}
