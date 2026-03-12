// src/app/mappings/billing/billing.mapper.ts
import { BillingDocumentCategoryMap, BillingDocumentDescriptionMap } from '../billingdocuments/billingdocuments.mapper'
import { RequisitionMap } from '../requisitions/requisitions.mapp'

import {
  BillingImages,
  BillingImagesByEmployee,
  BillingImageEmployee,
  BillingImageItem,
  BillingImagesTable,
  BillingPost,
  BillingPut,
} from './billingimages.types'

const normalizeImageItems = (rawImages: unknown): BillingImageItem[] => {
  if (Array.isArray(rawImages)) {
    return rawImages
      .map((img) => {
        if (typeof img === 'string') return { image: img }
        if (!img || typeof img !== 'object') return null
        const raw = img as any
        const image = raw?.image ?? raw?.url ?? raw?.imageUrl ?? ''
        const status = raw?.status_id ?? raw?.statusId ?? undefined
        if (!image) return null
        return { image: String(image), status_id: status ? String(status) : undefined }
      })
      .filter((img): img is BillingImageItem => Boolean(img))
  }
  if (typeof rawImages === 'string') return rawImages ? [{ image: rawImages }] : []
  return []
}

const getImageUrls = (images: BillingImageItem[] | Array<string | BillingImageItem>): string[] =>
  Array.isArray(images)
    ? images
        .map((img) => (typeof img === 'string' ? img : img?.image ?? ''))
        .filter((img) => Boolean(img))
    : []

const mapBillingImageEmployee = (raw: any): BillingImageEmployee => ({
  employee_id: String(raw?.employee_id ?? ''),
  employee_number: String(raw?.employee_number ?? ''),
  firstname: String(raw?.firstname ?? ''),
  secondname: String(raw?.secondname ?? ''),
  lastname: String(raw?.lastname ?? ''),
  motherlast_name: String(raw?.motherlast_name ?? ''),
  gender: String(raw?.gender ?? ''),
  email: String(raw?.email ?? ''),
  phone_number: String(raw?.phone_number ?? ''),
  extension: String(raw?.extension ?? ''),
  image_url: String(raw?.image_url ?? ''),
  user_id: String(raw?.user_id ?? ''),
  workposition_id: String(raw?.workposition_id ?? ''),
  manager_id: String(raw?.manager_id ?? ''),
  department_id: String(raw?.department_id ?? ''),
  role_id: raw?.role_id ?? null,
  fullname: String(raw?.fullname ?? ''),
})

/**
 * BillingImageByEmployeeMap
 * Mapea un registro crudo de la API a un objeto tipado BillingImagesByEmployee.
 */
export const BillingImageByEmployeeMap = (raw: any): BillingImagesByEmployee => ({
  billing_image_id: String(raw?.billing_image_id ?? ''),
  employee: mapBillingImageEmployee(raw?.employee),
  category: BillingDocumentCategoryMap(raw?.Category ?? raw?.category),
  description: BillingDocumentDescriptionMap(raw?.description),
  numpersons: Number(raw?.numpersons ?? 0),
  numnights: Number(raw?.numnights ?? 0),
  status: String(raw?.status ?? ''),
  images: normalizeImageItems(raw?.images),
  comments: String(raw?.comments ?? ''),
  user_comments: String(raw?.user_comments ?? ''),
  dateCreate: String(raw?.date_created ?? ''),
})

/**
 * BillingImagesByEmployeeMap
 * Mapea una colección cruda de la API a un arreglo tipado.
 */
export const BillingImagesByEmployeeMap = (list: any[]): BillingImagesByEmployee[] =>
  Array.isArray(list) ? list.map(BillingImageByEmployeeMap) : []
/**
 * BillingImageMap
 * Mapea un registro crudo de la API a un objeto tipado BillingImages.
 */
export const BillingImageMap = (raw: any): BillingImages => ({
  billing_image_id: String(
    raw?.billing_image_id ??
      raw?.billingImagesId ??
      raw?.billingimages_id ??
      raw?.billingImages_id ??
      raw?.billingImageId ??
      raw?.id ??
      '',
  ),
  requisition: RequisitionMap(raw?.requisition ?? raw?.Requisition),
  status: String(raw?.status ?? ''),
  images: normalizeImageItems(
    raw?.images ??
      raw?.Images ??
      raw?.imageUrls ??
      raw?.imageUrl ??
      raw?.image ??
      raw?.Image,
  ),
  comments: String(raw?.comments ?? ''),
  user_comments: String(raw?.user_comments ?? ''),
  dateCreate: String(raw?.date_created ?? raw?.dateCreate ?? raw?.created_at ?? raw?.dateCreated ?? ''),
  category: BillingDocumentCategoryMap(raw?.Category ?? raw?.category),
  description: BillingDocumentDescriptionMap(raw?.description ?? raw?.Description),
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
  employee_id: String(src?.employee_id ?? ''),
  ...(src?.requisition_id ? { requisition_id: String(src.requisition_id) } : {}),
  images: Array.isArray(src?.images)
    ? getImageUrls(src.images)
    : src?.images
      ? [String(src.images)]
      : [],
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
  image: String(
    src?.image ??
      (Array.isArray(src?.images) ? getImageUrls(src.images)[0] : src?.images ?? ''),
  ),
  comments: String(src?.comments ?? ''),
  user_comments: String(src?.user_comments ?? ''),
  description: String(src?.description ?? ''),
  numpersons: String(src?.numpersons ?? 0),
  numnights: String(src?.numnights ?? 0),
  category_id: String(src?.category_id)

})
export const BillingImagesTableMap = (src: BillingImages[]): BillingImagesTable[] => {
  return src.map(item => {
    const imageUrls = getImageUrls(item?.images ?? [])
    const resolvedId = item.billing_image_id || imageUrls[0] || item?.requisition?.billingrequisition_id || ''
    return {
      id: resolvedId,
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
