// src/app/mappings/billing/billingdocuments.mapper.ts
import { mapAuthorization } from '../authorizations/authorizations.mapper';
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
  ExpenseTypeCatalog,
  BillingDocumentFull,
  BillingDocumentNotDeductible,
  CompleteProcessToSAPRequest,
  CompleteProcessToSAPResponse,
  BillingDocumentCategoryFull,
  BillingDocumentDescriptionFull,
  BillingDocumentJsonSap,
  BillingDocumentJsonSapItem
} from './billingdocuments.types';
import {  toInputDateTimeString } from '@/app/utilities/FormatHelpers/FormatHelpets';

/** ---------------------- Helpers ---------------------- */
const toString = (v: unknown, fallback = "") => (v == null ? fallback : String(v));
const toBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }
  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }
  return fallback;
};
const toNumberOrUndefined = (value: unknown): number | undefined => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};
const pickJsonSapNumber = (value: unknown, fallback: unknown): number => {
  const normalizedValue = typeof value === "string" ? value.trim() : value;
  const parsedValue = toNumberOrUndefined(normalizedValue);
  if (parsedValue != null) return parsedValue;

  const parsedFallback = toNumberOrUndefined(fallback);
  return parsedFallback ?? 0;
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
const mapJsonSapItem = (raw: any): BillingDocumentJsonSapItem => ({
  itemIndex: Number(raw?.itemIndex ?? 0),
  claveInterna: toString(raw?.claveInterna),
  claveProdServ: toString(raw?.claveProdServ),
  descripcion: toString(raw?.descripcion),
  importe: toString(raw?.importe),
  importeImpuesto: toString(raw?.importeImpuesto),
  impuesto: toString(raw?.impuesto),
  tasaCuota: toString(raw?.tasaCuota),
});

const mapJsonSap = (raw: any): BillingDocumentJsonSap | null => {
  if (!raw) return null;
  let normalizedRaw = raw;

  if (typeof raw === 'string') {
    try {
      normalizedRaw = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (!normalizedRaw || typeof normalizedRaw !== 'object') return null;
  return {
    iva: toString(normalizedRaw?.iva),
    subtotal: toString(normalizedRaw?.subtotal),
    total: toString(normalizedRaw?.total),
    otherInvoices: toString(
      normalizedRaw?.otherInvoices ??
        normalizedRaw?.otherinvoices ??
        normalizedRaw?.OtherInvoices,
    ),
    moneda: toString(normalizedRaw?.moneda),
    expenseType : toString(normalizedRaw?.expenseType),
    iscompleted: toBoolean(normalizedRaw?.iscompleted),
    items: Array.isArray(normalizedRaw?.items) ? normalizedRaw.items.map(mapJsonSapItem) : [],
  };
};

/** ---------------------- Submappers ---------------------- */
export const BillingDocumentCategoryMap = (raw: any): BillingDocumentCategory => {
  if (typeof raw === 'string') {
    return { id_billingcategory: '', name: toString(raw) };
  }
  const id =
    raw?.id_billingcategory ??
    raw?.billingcategory_id ??
    raw?.billingCategoryId ??
    raw?.category_id ??
    raw?.categoryId ??
    raw?.id;
  return {
    id_billingcategory: toString(id),
    name: toString(raw?.name)
  };
};

export const BillingDocumentDescriptionMap = (raw: any): BillingDocumentDescription => {
  if (typeof raw === 'string') {
    return { id_billingdescription: '', name: toString(raw) };
  }
  const id =
    raw?.id_billingdescription ??
    raw?.billingdescription_id ??
    raw?.billingDescriptionId ??
    raw?.description_id ??
    raw?.descriptionId ??
    raw?.id;
  return {
    id_billingdescription: toString(id),
    name: toString(raw?.name)
  };
};

export const BillingDocumentCategoryFullMap = (raw: any): BillingDocumentCategoryFull => ({
  id: toString(raw?.id),
  name: toString(raw?.name)
});

export const BillingDocumentDescriptionFullMap = (raw: any): BillingDocumentDescriptionFull => ({
  id: toString(raw?.id),
  name: toString(raw?.name)
});

export const ExpenseTypeCatalogMap = (raw: any): ExpenseTypeCatalog => ({
  id: toString(raw?.id),
  satKey: toString(raw?.satKey ?? raw?.sat_key),
  descriptionSatKey: toString(raw?.descriptionSatKey ?? raw?.description_sat_key),
  internalKey: toString(raw?.internalKey ?? raw?.internal_key),
  descriptionInternalKey: toString(raw?.descriptionInternalKey ?? raw?.description_internal_key),
  gtStype: toString(raw?.gtStype ?? raw?.gstype),
  iva: Number(raw?.iva ?? 0),
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
export const BillingDocumentMap = (raw: any): BillingDocuments => {
  const jsonSap = mapJsonSap(raw?.json_sap);
  return ({
  id: toString(raw?.billingdocument_id ?? raw?.id),
  billingdocument_id: toString(raw?.billingdocument_id ?? raw?.id),
  requisition: RequisitionMap(raw?.requisition ?? raw?.Requisition ?? {}),
  billingimages_id: toString(raw?.billingimages_id ?? raw?.billingImages_id),
  xml: toString(raw?.xml ?? raw?.xmlUrl ?? raw?.xml_url),
  pdf: toString(raw?.pdf ?? raw?.pdfUrl ?? raw?.pdf_url),
  image: toString(raw?.image ?? raw?.imageUrl ?? raw?.image_url),
  status: toString(raw?.status),
  comments: toString(raw?.comments),
  rfc_emisor: toString(raw?.rfc_emisor),
  rfc_receptor: toString(raw?.rfc_receptor),
  conceptos: Array.isArray(raw?.conceptos) ? raw.conceptos.map(mapConcepto) : [],
  uuid: toString(raw?.uuid),
  fecha: toInputDateTimeString(
    raw?.fecha ||
      raw?.certification_date ||
      raw?.certificationDate ||
      raw?.date_created ||
      raw?.dateCreated,
  ),
  xmlinformation: toString(raw?.xmlinformation),
  date_created: raw?.date_created,
  forbidden_code: Boolean(raw?.forbidden_code),
  user_comments: toString(raw?.user_comments),
  sat_validation: Boolean(raw?.sat_validation),
  billingAcuse: raw?.billingAcuse ? BillingAcuseMap(raw.billingAcuse) : null,
  description: BillingDocumentDescriptionMap(raw?.description ?? raw?.Description),
  numpersons: Number(raw?.numpersons ?? 0),
  numnights: Number(raw?.numnights ?? 0),
  total: pickJsonSapNumber(jsonSap?.total, raw?.total),
  subtotal: pickJsonSapNumber(jsonSap?.subtotal, raw?.subtotal),
  iva: pickJsonSapNumber(jsonSap?.iva, raw?.iva),
  otherinvoices: Number(raw?.otherinvoices ?? 0),
  json_sap: jsonSap,
  category: BillingDocumentCategoryMap(raw?.category ?? raw?.Category),
  validatedbyoperations: Boolean(raw?.validatedbyoperations),
  requisitionkey: toString(raw?.requisition?.requisitionkey),
  authorization: raw?.authorization ? mapAuthorization(raw.authorization) : null,
});
};

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
  billingimages_id: raw?.billingimages_id ?? null,
  comments: raw?.comments,
  user_comments: raw?.user_comments,
  authorization: raw?.authorization ?? null,
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
  requisitionkey: toString(raw?.requisition?.requisitionkey),
});

export const BillingDocumentsSatTableListMap = (list: any[]): BillingDocumentsSatTable[] =>
  Array.isArray(list) ? list.map(BillingDocumentSatTableMap) : [];

/** ---------------------- Otros mappers ---------------------- */
export const BillingDocumentsMap = (list: any[]): BillingDocuments[] =>
  Array.isArray(list)
    ? list.map((data) => {
        if (data?.document) {
          return BillingDocumentMap({
            ...data.document,
            authorization: data.authorization ?? data.document?.authorization ?? null,
          })
        }
        return BillingDocumentMap(data)
      })
    : [];

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

export const BillingDocumentNotDeductibleMap = (
  src: Partial<BillingDocumentNotDeductible> | any,
): BillingDocumentNotDeductible => ({
  requisition_id: String(src?.requisition_id ?? ''),
  billingimages_id: String(src?.billingimages_id ?? ''),
  numpersons: Number(src?.numpersons ?? 0),
  total: Number(src?.total ?? 0),
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

export const mapCompleteProcessToSAPResponse = (raw: unknown): CompleteProcessToSAPResponse => {
  const source = isRecord(raw) ? raw : {};
  const documents = Array.isArray(source.documents) ? source.documents : [];

  return {
    message: toString(source.message),
    successfulDocuments: Number(source.successfulDocuments ?? 0),
    failedDocuments: Number(source.failedDocuments ?? 0),
    documents: documents.map((document) => {
      const item = isRecord(document) ? document : {};

      return {
        billingDocumentId: toString(item.billingDocumentId),
        uuid: toString(item.uuid),
        errorMessage: toString(item.errorMessage),
      };
    }),
  };
};
