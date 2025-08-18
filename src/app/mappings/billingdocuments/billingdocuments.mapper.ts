// src/app/mappings/billing/billingdocuments.mapper.ts
import {
  BillingDocuments,
  BillingDocumentsPost,
  BillingDocumentsPut,
  Concepto,
  BillingDocumentsSatTable,
  BillingAcuse
} from './billingdocuments.types'
import { Requisition } from '../requisitions/requisitions.types';

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

// Si ya tienes un mapper de Requisition, úsalo aquí en lugar de cast directo.
const mapRequisition = (raw: any): Requisition => raw as Requisition;

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
  requisition: mapRequisition(raw?.requisition ?? {}),
  billingimages_id: toString(raw?.billingimages_id),
  xml: toString(raw?.xml),
  pdf: toString(raw?.pdf),
  image:toString(raw?.image),
  status: toString(raw?.status),
  comments: toString(raw?.comments),
  rfc_emisor: toString(raw?.rfc_emisor),
  rfc_receptor: toString(raw?.rfc_receptor),
  conceptos: Array.isArray(raw?.conceptos) ? raw.conceptos.map(mapConcepto) : [],
  uuid: toString(raw?.uuid),
  fecha: toString(raw?.fecha ?? raw?.date),
  importe: toString(raw?.importe ?? raw?.total),
  xmlinformation: toString(raw?.xmlinformation),
  date_created: toString(raw?.date_created ?? raw?.created_at),
  forbidden_code: Boolean(raw?.forbidden_code),
  user_comments: toString(raw?.user_comments),
  sat_validation: Boolean(raw?.sat_validation),
  billingAcuse: raw?.billingAcuse ? BillingAcuseMap(raw.billingAcuse) : null,
});


export const BillingDocumentSatTableMap = (raw: BillingDocuments): BillingDocumentsSatTable => ({
  id: toString(raw?.billingdocument_id ?? raw?.id),
  billingdocument_id: toString(raw?.billingdocument_id ?? raw?.id),
  requisition: mapRequisition(raw?.requisition ?? {}),
  billingimages_id: toString(raw?.billingimages_id),
  xml: toString(raw?.xml),
  pdf: toString(raw?.pdf),
  status: toString(raw?.status),
  comments: toString(raw?.comments),
  rfc_emisor: toString(raw?.rfc_emisor),
  rfc_receptor: toString(raw?.rfc_receptor),
  conceptos: Array.isArray(raw?.conceptos) ? raw.conceptos.map(mapConcepto) : [],
  uuid: toString(raw?.uuid),
  // Fallbacks por si tu API usa nombres distintos
  fecha: toString(raw?.fecha),
  importe: toString(raw?.importe),
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
  image:toString(raw?.image)
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
  billingimages_id: String(src?.billingimages_id ?? ''),
  xml: String(src?.xml ?? ''),
  pdf: String(src?.pdf ?? ''),
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
  billingimages_id: String(src?.billingimages_id ?? ''),
  xml: String(src?.xml ?? ''),
  pdf: String(src?.pdf ?? ''),
  comments: String(src?.comments ?? ''),
})
