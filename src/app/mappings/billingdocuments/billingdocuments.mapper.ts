// src/app/mappings/billing/billingdocuments.mapper.ts
import { RequisitionMap } from '../requisitions/requisitions.mapp';

import {
  BillingDocuments,
  BillingDocumentsPost,
  BillingDocumentsPut,
  Concepto,
  BillingDocumentsSatTable,
  BillingAcuse,
  BillingDocumentDetailsTable,
  BillingDocumentCategory,
  BillingDocumentDescription
} from './billingdocuments.types'

import { toInputDateString,toInputDateTimeString } from '@/app/utilities/FormatHelpers/FormatHelpets';
/**
 * BillingDocumentMap
 * Mapea un registro crudo de la API a un objeto tipado BillingDocuments.
 */
const toString = (v: unknown, fallback = "") => (v == null ? fallback : String(v));


const mapConcepto = (raw: any): Concepto => ({
  clave_sat: toString(raw?.clave_sat),
  // Acepta también 'descripcion' por si el backend la nombra distinto
  clavesat_description: toString(raw?.clavesat_description ?? raw?.descripcion),
});



export const BillingDocumentCategoryMap = (raw: any): BillingDocumentCategory => ({
  id_billingcategory: toString(raw?.id),
  name: toString(raw?.name)
})
export const BillingDocumentDescriptionMap = (raw: any): BillingDocumentDescription => ({
  id_billingdescription: toString(raw?.id),
  name: toString(raw?.name)
})
export const BillingAcuseMap = (raw: any): BillingAcuse => ({
  id: toString(raw?.id),
  statusCode: toString(raw?.statusCode),
  isCancellable: toString(raw?.isCancellable),
  status: toString(raw?.status),
  cancelationStatus: toString(raw?.cancelationStatus),
  validationEFOS: toString(raw?.validationEFOS),
  dateCreated: toString(raw?.dateCreated),
  billingDocuments: null, // según tu modelo actual siempre null
});

export const BillingDocumentMap = (raw: any): BillingDocuments => ({
  id: toString(raw?.billingdocument_id ?? raw?.id),
  billingdocument_id: toString(raw?.billingdocument_id ?? raw?.id),
  requisition: RequisitionMap(raw?.requisition ?? {}),
  billingimages_id: toString(raw?.billingimages_id),
  xml: toString(raw?.xml),
  pdf: toString(raw?.pdf),
  image: toString(raw?.image),
  status: toString(raw?.status),
  comments: toString(raw?.comments),
  rfc_emisor: toString(raw?.rfc_emisor),
  rfc_receptor: toString(raw?.rfc_receptor),
  conceptos: Array.isArray(raw?.conceptos) ? raw.conceptos.map(mapConcepto) : [],
  uuid: toString(raw?.uuid),
  fecha: toInputDateTimeString(raw?.fecha || raw?.certification_date),
  xmlinformation: toString(raw?.xmlinformation),
  date_created: toInputDateString(raw?.date_created ?? raw?.created_at),
  forbidden_code: Boolean(raw?.forbidden_code),
  user_comments: toString(raw?.user_comments),
  sat_validation: Boolean(raw?.sat_validation),
  billingAcuse: raw?.billingAcuse ? BillingAcuseMap(raw.billingAcuse) : null,
  description: BillingDocumentDescriptionMap(raw?.description),
  numpersons: Number(raw?.numpersons ?? 0),
  numnights: Number(raw?.numnights ?? 0),
  total: Number(raw?.total),
  subtotal: Number(raw?.subtotal),
  iva: Number(raw?.iva),
  otherinvoices: Number(raw?.otherinvoices),
  category: BillingDocumentCategoryMap(raw?.category),
  validatedbyoperations: Boolean(raw?.validatedbyoperations)
});

export const BillingDocumentDetailsTableMap = (raw: BillingDocuments): BillingDocumentDetailsTable => ({
  "id": raw?.billingdocument_id,
  "billingdocument_id": raw?.billingdocument_id,
  "fecha": raw?.fecha,
  "rfc_emisor": raw?.rfc_emisor,
  "description": raw?.description?.name,
  "numpersons": raw?.numpersons,
  "numnights": raw?.numnights,
  "uuid": raw?.uuid,
  "subtotal": raw?.subtotal,
  "iva": raw?.iva,
  "total": raw?.total,
  "otherinvoices": raw?.otherinvoices,
  "status": raw?.status,
  "xmlUrl": raw?.xml,
  "pdfUrl": raw?.pdf,
  "imageUrl": raw?.image,
});

export const BillingDocumentDetailsTableListMap = (list: any[]): BillingDocumentDetailsTable[] =>
  Array.isArray(list) ? list.map(BillingDocumentDetailsTableMap) : [];
export const BillingDocumentSatTableMap = (raw: BillingDocuments): BillingDocumentsSatTable => ({
  id: toString(raw?.billingdocument_id ?? raw?.id),
  billingdocument_id: toString(raw?.billingdocument_id ?? raw?.id),
  requisition: RequisitionMap(raw?.requisition ?? {}),
  billingimages_id: toString(raw?.billingimages_id),
  xml: toString(raw?.xml),
  pdf: toString(raw?.pdf),
  image: toString(raw?.image),
  status: toString(raw?.status),
  comments: toString(raw?.comments),
  rfc_emisor: toString(raw?.rfc_emisor),
  rfc_receptor: toString(raw?.rfc_receptor),
  conceptos: Array.isArray(raw?.conceptos) ? raw.conceptos.map(mapConcepto) : [],
  uuid: toString(raw?.uuid),
  // Fallbacks por si tu API usa nombres distintos
  fecha: toString(raw?.requisition.assignmentdate),
  total: Number(raw.total),
  subtotal: Number(raw.subtotal),
  iva: Number(raw.iva),
  otherinvoices: Number(raw.otherinvoices),
  xmlinformation: toString(raw?.xmlinformation),
  date_created: toString(raw?.date_created),
  sat_status: toString(raw?.billingAcuse?.status),
  sat_efos: toString(raw?.billingAcuse?.validationEFOS),
  forbidden_code: Boolean(raw?.forbidden_code),
  user_comments: toString(raw?.user_comments),
  sat_codigoEstatus: toString(raw?.billingAcuse?.statusCode),
  sat_esCancelable: toString(raw?.billingAcuse?.isCancellable),
  sat_estatusCancelacion: toString(raw?.billingAcuse?.cancelationStatus),
  sat_validation: Boolean(raw?.sat_validation),
  description: raw.description,
  numnights: raw.numnights,
  numpersons: raw.numpersons,
  category: raw.category,
  billingAcuse: raw?.billingAcuse,
  validatedbyoperations: raw?.validatedbyoperations
});

/**
 * BillingDocumentsMap
 * Mapea una colección cruda de la API a un arreglo tipado.
 */
export const BillingDocumentsMap = (list: any[]): BillingDocuments[] =>
  Array.isArray(list) ? list.map(BillingDocumentMap) : []

export const BillingDocumentsSatTableMap = (list: any[]): BillingDocumentsSatTable[] =>
  Array.isArray(list) ? list.map(BillingDocumentSatTableMap) : []

/**
 * BillingDocumentsPostMap
 * Construye el payload para crear un documento de facturación (POST).
 */
export const BillingDocumentsPostMap = (
  src: Partial<BillingDocumentsPost> | any
): BillingDocumentsPost => ({
  requisition_id: String(src?.requisition_id ?? ''),
  billingimages_id: src?.billingimages_id || null,
  xml: String(src?.xml ?? ''),
  pdf: String(src?.pdf ?? ''),
  description_id: String(src?.description_id ?? ''),
  numpersons: Number(src?.numpersons ?? 0),
  numnights: Number(src?.numnights ?? 0),
  category_id: String(src.category_id)
})

/**
 * BillingDocumentsPutMap
 * Construye el payload para actualizar un documento de facturación (PUT).
 */
export const BillingDocumentsPutMap = (
  src: Partial<BillingDocumentsPut> | any
): BillingDocumentsPut => ({
  billingdocument_id: String(src?.billingdocument_id ?? ''),
  requisition_id: String(src?.requisition_id ?? ''),
  billingimages_id: src?.billingimages_id || null,
  xml: String(src?.xml ?? ''),
  pdf: String(src?.pdf ?? ''),
  comments: String(src?.comments ?? ''),
  description_id: String(src?.description_id ?? ''),
  numpersons: Number(src?.numpersons ?? 0),
  numnights: Number(src?.numnights ?? 0),
  category_id: String(src?.category_id),
  user_comments: src?.user_comments,
})
