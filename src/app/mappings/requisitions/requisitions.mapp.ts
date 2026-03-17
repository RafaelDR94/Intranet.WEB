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
    image_url: toStringSafe(
      record.image_url ?? record.imageUrl ?? record.profile_image ?? record.profileImage,
    ),
  }
}

/**
 * BenefitsMap
 * Mapea una colección cruda de la API a un arreglo tipado Benefit.
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

const normalizeDateLike = (value: unknown): string | Date | null => {
  if (!value) return null
  if (value instanceof Date) return value
  const raw = String(value).trim()
  if (!raw) return null
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(raw)) {
    return raw.replace(' ', 'T')
  }
  return raw
}

const toInputDateStringSafe = (value: unknown): string => {
  const normalized = normalizeDateLike(value)
  if (!normalized) return ''
  const d = new Date(normalized)
  if (Number.isNaN(d.getTime())) {
    const datePart = String(normalized).split(' ')[0]
    if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart
    return ''
  }
  return toInputDateString(normalized)
}

const toLocalYmd = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const dateFromYmd = (ymd: string): Date | null => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null
  return new Date(year, month - 1, day)
}

const diffDays = (from: Date, to: Date): number => {
  const ms = to.getTime() - from.getTime()
  return Math.floor(ms / 86400000)
}

const computeCurrentDay = (startYmd: string, endYmd: string): number => {
  const start = dateFromYmd(startYmd)
  if (!start) return 0

  const end = dateFromYmd(endYmd) ?? start
  const totalDays = Math.max(1, diffDays(start, end) + 1)

  const today = dateFromYmd(toLocalYmd(new Date()))
  if (!today) return 0

  if (today.getTime() < start.getTime()) return 0
  if (today.getTime() > end.getTime()) return totalDays

  return diffDays(start, today) + 1
}
/**
 * RequisitionMap
 * Mapea un registro crudo de la API a un objeto tipado Requisition.
 */
export const RequisitionMap = (raw: unknown): Requisition => {
  const billingData = getBillingData(raw)
  const documents = getBillingDocuments(raw)
  const assignmentDate =
    (billingData as any)?.AssignmentDate ??
    (billingData as any)?.assignmentdate ??
    (billingData as any)?.assignmentDate
  const endDate =
    (billingData as any)?.EndDate ??
    (billingData as any)?.enddate ??
    (billingData as any)?.endDate
  const projectId =
    (billingData as any)?.idproject ??
    (billingData as any)?.idProject ??
    (billingData as any)?.Proyect ??
    (billingData as any)?.proyect
  const currentDays = (billingData as any)?.current_days ?? (billingData as any)?.currentDays
  const requisitionskey =
    (billingData as any)?.Code_Number ??
    (billingData as any)?.code_number ??
    (billingData as any)?.requisitionkey ??
    (billingData as any)?.requisition_key
  const billingrequisitionId =
    (billingData as any)?.Id_Requisition ??
    (billingData as any)?.id_requisition ??
    (billingData as any)?.billingrequisition_id ??
    (billingData as any)?.requisition_id
  const projectName =
    (billingData as any)?.Proyect ??
    (billingData as any)?.proyect ??
    (billingData as any)?.projectname ??
    ''
  const createdDate = (billingData as any)?.date_created ?? assignmentDate ?? ''
  const assignmentYmd = toInputDateStringSafe(assignmentDate)
  const endYmd = toInputDateStringSafe(endDate)
  const rawPeriod = (billingData as any)?.period
  const periodValue =
    typeof rawPeriod === 'string' && rawPeriod.trim()
      ? rawPeriod
      : assignmentYmd && endYmd
        ? `${assignmentYmd} - ${endYmd}`
        : ''
  const currentDaysValueRaw = Number(currentDays)
  const currentDaysValue = Number.isFinite(currentDaysValueRaw) && currentDaysValueRaw > 0
    ? currentDaysValueRaw
    : computeCurrentDay(assignmentYmd, endYmd || assignmentYmd)
  return {
    billingrequisition_id: String(billingrequisitionId??''),
    requisitionkey: String(requisitionskey ?? ''),
    id_Employee: String((billingData as any)?.employee_id ?? (billingData as any)?.idEmployee ?? (billingData as any)?.id_Employee ?? ''),
    employeename: String((billingData as any)?.Employe_Name ?? (billingData as any)?.Employee_Name ?? (billingData as any)?.employeename ?? ''),
    idProject: String(projectId ?? ''),
    projectname: String(projectName),
    assignmentdate: assignmentYmd,
    endDate: endYmd,
    motive: String((billingData as any)?.motive ?? ''),
    state: String((billingData as any)?.State ?? ''),
    amountdeposited: String((billingData as any)?.amountdeposited ?? ''),
    provenamount: String((billingData as any)?.provenamount ?? ''),
    amountdifference: String((billingData as any)?.amountdifference ?? ''),
    date_created: toInputDateStringSafe(createdDate),
    status: String((billingData as any)?.Requisition_Status ?? (billingData as any)?.requisition_status ?? (billingData as any)?.status ?? ''),
    gts_type: String((billingData as any)?.gts_type ?? ''),
    email: String((billingData as any)?.email ?? ''),
    phone_number: String((billingData as any)?.phone_number ?? ''),
    image_url: String((billingData as any)?.image_url ?? ''),
    period: periodValue,
    current_days: currentDaysValue,
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
