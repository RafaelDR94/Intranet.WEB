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
  BillingDocumentDescription,
  BillingDocumentFull,
  CompleteProcessToSAPRequest,
  BillingDocumentCategoryFull,
  BillingDocumentDescriptionFull
} from './billingdocuments.types';
import { toInputDateString, toInputDateTimeString } from '@/app/utilities/FormatHelpers/FormatHelpets';

/** ---------------------- Helpers ---------------------- */
const toString = (v: unknown, fallback = "") => (v == null ? fallback : String(v));
const toNumberOrUndefined = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/** ---------------------- Conceptos ---------------------- */
const mapConcepto = (raw: any): Concepto => ({
  clave_sat: toString(raw?.clave_sat),
  clavesat_description: toString(raw?.clavesat_description ?? ""),
  cantidad: toNumberOrUndefined(raw?.cantidad),
  valor_unitario: toNumberOrUndefined(raw?.valor_unitario),
  importe: toNumberOrUndefined(raw?.importe),
  porcentajeiva: toNumberOrUndefined(raw?.porcentajeiva),
  tipo_gasto: raw?.tipo_gasto == null ? undefined : toString(raw?.tipo_gasto),
  grupo_iva: raw?.grupo_iva == null ? undefined : toString(raw?.grupo_iva),
});

/** ---------------------- Submappers ---------------------- */
export const BillingDocumentCategoryMap = (raw: any): BillingDocumentCategory => ({
  id_billingcategory: toString(raw?.id),
  name: toString(raw?.name)
});

export const BillingDocumentDescriptionMap = (raw: any): BillingDocumentDescription => ({
  id_billingdescription: toString(raw?.id),
  name: toString(raw?.name)
});

export const BillingDocumentCategoryFullMap = (raw: any): BillingDocumentCategoryFull => ({
  id: toString(raw?.id),
  name: toString(raw?.name)
});

export const BillingDocumentDescriptionFullMap = (raw: any): BillingDocumentDescriptionFull => ({
  id: toString(raw?.id),
  name: toString(raw?.name)
});

export const BillingAcuseMap = (raw: any): BillingAcuse => ({
  id: toString(raw?.id),
  statusCode: toString(raw?.statusCode),
  isCancellable: toString(raw?.isCancellable),
  status: toString(raw?.status),
  cancelationStatus: toString(raw?.cancelationStatus),
  validationEFOS: toString(raw?.validationEFOS),
  dateCreated: toString(raw?.dateCreated),
  billingDocuments: null,
});

/** ---------------------- BillingDocumentMap ---------------------- */
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

/** ---------------------- BillingDocumentDetails ---------------------- */
export const BillingDocumentDetailsTableMap = (raw: BillingDocuments): BillingDocumentDetailsTable => ({
  id: raw?.billingdocument_id,
  billingdocument_id: raw?.billingdocument_id,
  fecha: raw?.fecha,
  rfc_emisor: raw?.rfc_emisor,
  description: raw?.description?.name,
  numpersons: raw?.numpersons,
  numnights: raw?.numnights,
  uuid: raw?.uuid,
  subtotal: raw?.subtotal,
  iva: raw?.iva,
  total: raw?.total,
  otherinvoices: raw?.otherinvoices,
  status: raw?.status,
  xmlUrl: raw?.xml,
  pdfUrl: raw?.pdf,
  imageUrl: raw?.image,
});

export const BillingDocumentDetailsTableListMap = (list: any[]): BillingDocumentDetailsTable[] =>
  Array.isArray(list) ? list.map(BillingDocumentDetailsTableMap) : [];

/** ---------------------- BillingDocumentSatTable ---------------------- */
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
  fecha: toString(raw?.requisition?.assignmentdate ?? ""),
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
  validatedbyoperations: raw?.validatedbyoperations,
  employeename: raw?.requisition?.employeename,
});

export const BillingDocumentsSatTableListMap = (list: any[]): BillingDocumentsSatTable[] =>
  Array.isArray(list) ? list.map(BillingDocumentSatTableMap) : [];

/** ---------------------- Otros mappers ---------------------- */
export const BillingDocumentsMap = (list: any[]): BillingDocuments[] =>
  Array.isArray(list) ? list.map(BillingDocumentMap) : [];

export const BillingDocumentsPostMap = (src: Partial<BillingDocumentsPost> | any): BillingDocumentsPost => ({
  requisition_id: String(src?.requisition_id ?? ''),
  billingimages_id: src?.billingimages_id || null,
  xml: String(src?.xml ?? ''),
  pdf: String(src?.pdf ?? ''),
  description_id: String(src?.description_id ?? ''),
  numpersons: Number(src?.numpersons ?? 0),
  numnights: Number(src?.numnights ?? 0),
  category_id: String(src.category_id),
});

export const BillingDocumentsPutMap = (src: Partial<BillingDocumentsPut> | any): BillingDocumentsPut => ({
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
});

/** ---------------------- Full mapper ---------------------- */
export const BillingDocumentFullMap = (raw: any): BillingDocumentFull => ({
  billingdocument_id: raw.billingdocument_id,
  requisition: raw.requisition,
  billingimages_id: raw.billingimages_id ?? null,
  xml: raw.xml ?? '',
  pdf: raw.pdf ?? '',
  image: raw.image ?? null,
  status: raw.status ?? '',
  comments: raw.comments ?? null,
  rfc_emisor: raw.rfc_emisor ?? '',
  rfc_receptor: raw.rfc_receptor ?? '',
  conceptos: raw.conceptos ?? null,
  uuid: raw.uuid ?? '',
  importe: raw.importe ?? 0,
  xmlinformation: raw.xmlinformation ?? '',
  certification_date: raw.certification_date ?? '',
  date_created: raw.date_created ?? '',
  sat_validation: raw.sat_validation ?? false,
  SAP_Pending: raw.SAP_Pending ?? false,
  complete_SAP: raw.complete_SAP ?? false,
  billingAcuse: raw.billingAcuse ?? null,
  forbidden_code: raw.forbidden_code ?? false,
  user_comments: raw.user_comments ?? '',
  validatedbyoperations: raw.validatedbyoperations ?? false,
  description: {
    id: raw.description?.id ?? '',
    name: raw.description?.name ?? '',
  },
  numpersons: raw.numpersons ?? 0,
  numnights: raw.numnights ?? 0,
  total: raw.total ?? 0,
  subtotal: raw.subtotal ?? 0,
  iva: raw.iva ?? 0,
  otherinvoices: raw.otherinvoices ?? 0,
  category: {
    id: raw.category?.id ?? '',
    name: raw.category?.name ?? '',
  },
});

export const mapToCompleteProcessToSAP = (ids: string[]): CompleteProcessToSAPRequest => {
  return ids;
};
