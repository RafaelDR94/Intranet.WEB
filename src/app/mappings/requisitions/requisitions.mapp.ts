// src/app/mappings/requisitions/requisitions.mapper.ts
import {
  BillingDocumentRequisition,
  Benefit,
  Requisition,
  RequitionPost,
  RequitionPut,

} from './requisitions.types'
import { mapAuthorization } from '../authorizations/authorizations.mapper'
import { toInputDateString } from '@/app/utilities/FormatHelpers/FormatHelpets'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const extractName = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (isRecord(value) && typeof value.name === 'string') return value.name
  return ''
}

const toStringSafe = (value: unknown, fallback = ''): string =>
  value == null ? fallback : String(value)

const buildFullname = (raw: Record<string, unknown>): string => {
  const direct = toStringSafe(
    raw.fullname ?? raw.employeename ?? raw.employee_name ?? raw.name ?? '',
  )
  if (direct.trim()) return direct.trim()
  return [
    raw.firstname,
    raw.secondname,
    raw.lastname,
    raw.motherlast_name,
  ]
    .map((part) => toStringSafe(part).trim())
    .filter((part) => part)
    .join(' ')
}

/**
 * BenefitMap
 * Mapea un registro crudo de la API a un objeto tipado Benefit.
 */
export const BenefitMap = (raw: unknown): Benefit => {
 
  const record = isRecord(raw) ? raw : {}
  const idEmployee = toStringSafe(
    record.id_employee ?? record.employee_id ?? record.idEmployee ?? record.employeeId ?? record.id,
  )
  const fullname = buildFullname(record)

  return {
    id_employee: idEmployee,
    fullname,
    email: toStringSafe(record.email ?? record.mail),
    phone_number: toStringSafe(record.phone_number ?? record.phoneNumber ?? record.phone),
  }
}

/**
 * BenefitsMap
 * Mapea una colecciÃ³n cruda de la API a un arreglo tipado Benefit.
 */
export const BenefitsMap = (list: unknown[]): Benefit[] =>
  Array.isArray(list) ? list.map(BenefitMap) : []

const getBillingData = (raw: unknown): Record<string, unknown> => {
;
  if (!isRecord(raw)) return {}
  if (isRecord(raw.billingRequisition)) return raw.billingRequisition
  if (isRecord(raw.billing_requisition)) return raw.billing_requisition
  return raw
}

const getBillingDocuments = (raw: unknown): unknown[] => {
  if (!isRecord(raw)) return []
  if (Array.isArray(raw.billingDocumentRquisition)) return raw.billingDocumentRquisition
  if (Array.isArray(raw.billing_document_requisition)) return raw.billing_document_requisition
  return []
}

const mapBillingDocumentRequisition = (
  raw: unknown,
): BillingDocumentRequisition => {
  const document = isRecord(raw) ? raw : {}

  return {
    billingdocument_id: String(document.billingdocument_id ?? ''),
    billingimages_id: (document.billingimages_id as string | null | undefined) ?? null,
    category: extractName(document.category) || null,
    description: extractName(document.description) || null,
    numpersons: Number(document.numpersons ?? 0),
    numnights: Number(document.numnights ?? 0),
    iva: Number(document.iva ?? 0),
    total: Number(document.total ?? 0),
    subtotal: Number(document.subtotal ?? 0),
    otherinvoices: Number(document.otherinvoices ?? 0),
    xml: (document.xml as string | null | undefined) ?? null,
    image: (document.image as string | null | undefined) ?? null,
    pdf: (document.pdf as string | null | undefined) ?? null,
    status: (document.status as string | null | undefined) ?? null,
    comments: (document.comments as string | null | undefined) ?? null,
    rfc_emisor: (document.rfc_emisor as string | null | undefined) ?? null,
    rfc_receptor: (document.rfc_receptor as string | null | undefined) ?? null,
    conceptos: (document.conceptos as string | null | undefined) ?? null,
    uuid: (document.uuid as string | null | undefined) ?? null,
    importe: (document.importe as string | null | undefined) ?? null,
    xmlinformation: (document.xmlinformation as string | null | undefined) ?? null,
    certification_date: (document.certification_date as string | null | undefined) ?? null,
    date_created: String(document.date_created ?? ''),
    sat_validation: Boolean(document.sat_validation),
    SAP_Pending: Boolean(document.SAP_Pending),
    complete_SAP: Boolean(document.complete_SAP),
    billingAcuse: (document.billingAcuse as string | null | undefined) ?? null,
    forbidden_code: Boolean(document.forbidden_code),
    user_comments: String(document.user_comments ?? ''),
    validatedbyoperations: Boolean(document.validatedbyoperations),
    employeename: extractName(document.employeename) || '',
    authorization: mapAuthorization(document.authorization ?? null),
  }
}

const mapBillingDocuments = (
  documents: unknown[],
): BillingDocumentRequisition[] =>
  Array.isArray(documents) ? documents.map(mapBillingDocumentRequisition) : []
/**
 * RequisitionMap
 * Mapea un registro crudo de la API a un objeto tipado Requisition.
 */
export const RequisitionMap = (raw: unknown): Requisition => {
  const billingData = getBillingData(raw)
  const documents = getBillingDocuments(raw)
  const assignmentDate = (billingData as any)?.assignmentdate ?? (billingData as any)?.assignmentDate
  const endDate = (billingData as any)?.enddate ?? (billingData as any)?.endDate
  const projectId = (billingData as any)?.idproject ?? (billingData as any)?.idProject
  const currentDays = (billingData as any)?.current_days ?? (billingData as any)?.currentDays
  const requisitionskey = (billingData as any)?.requisitionkey ?? (billingData as any)?.requisition_key
  const billingrequisitionId = (billingData as any)?.billingrequisition_id ?? (billingData as any)?.requisition_id
  return {
    billingrequisition_id: String(billingrequisitionId??''),
    requisitionkey: String(requisitionskey ?? ''),
    id_Employee: String((billingData as any)?.employee_id ?? ''),
    employeename: String((billingData as any)?.employeename ?? ''),
    idProject: String(projectId ?? ''),
    projectname: String((billingData as any)?.projectname ?? ''),
    assignmentdate: toInputDateString(assignmentDate) ?? '',
    endDate: toInputDateString(endDate) ?? '',
    motive: String((billingData as any)?.motive ?? ''),
    state: String((billingData as any)?.state ?? ''),
    amountdeposited: String((billingData as any)?.amountdeposited ?? ''),
    provenamount: String((billingData as any)?.provenamount ?? ''),
    amountdifference: String((billingData as any)?.amountdifference ?? ''),
    date_created: String((billingData as any)?.date_created ?? ''),
    status: String((billingData as any)?.status ?? ''),
    gts_type: String((billingData as any)?.gts_type ?? ''),
    email: String((billingData as any)?.email ?? ''),
    phone_number: String((billingData as any)?.phone_number ?? ''),
    period: String((billingData as any)?.period ?? ''),
    current_days: Number(currentDays ?? 0),
    billingDocumentRquisition: mapBillingDocuments(documents),
  }
}

/**
 * RequisitionsMap
 * Mapea una colección cruda de la API a un arreglo tipado.
 */
export const RequisitionsMap = (list: unknown[]): Requisition[] =>
  Array.isArray(list) ? list.map(RequisitionMap) : []

/**
 * RequitionPostMap
 * Construye el payload para crear una requisición (POST).
 * Acepta un objeto parcial (por ejemplo, valores del formulario)
 * y garantiza el shape correcto del payload.
 */
export const RequitionPostMap = (
  src: Partial<Requisition> | Record<string, unknown>,
): RequitionPost => ({
  requisitionkey: String(src?.requisitionkey ?? ''),
  employeename: String(src?.employeename ?? ''),
  projectname: String(src?.projectname ?? ''),
  assignmentdate: String(src?.assignmentdate ?? ''),
  endDate: String(src?.endDate ?? ''),
  motive: String(src?.motive ?? ''),
  state: String(src?.state ?? ''),
  amountdeposited: Number(src?.amountdeposited ?? ''),
  provenamount: Number(src?.provenamount ?? ''),
})

/**
 * RequitionPutMap
 * Construye el payload para actualizar una requisición (PUT).
 */
export const RequitionPutMap = (
  src: Partial<Requisition> | Record<string, unknown>,
): RequitionPut => ({
  billingrequisition_id: String(src?.billingrequisition_id ?? ''),
  requisitionkey: String(src?.requisitionkey ?? ''),
  employeename: String(src?.employeename ?? ''),
  projectname: String(src?.projectname ?? ''),
  assignmentdate: String(src?.assignmentdate ?? ''),
  endDate: String(src?.endDate ?? ''),
  motive: String(src?.motive ?? ''),
  state: String(src?.state ?? ''),
  amountdeposited: Number(src?.amountdeposited ?? ''),
  provenamount: Number(src?.provenamount ?? ''),
  amountdifference: Number(src?.amountdifference ?? ''),
  gts_type: String(src?.gts_type ?? ''),
})
