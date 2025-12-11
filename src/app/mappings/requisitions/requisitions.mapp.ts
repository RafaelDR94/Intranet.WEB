// src/app/mappings/requisitions/requisitions.mapper.ts
import {
  BillingDocumentRequisition,
  Requisition,
  RequitionPost,
  RequitionPut,
} from './requisitions.types'

import { toInputDateString } from '@/app/utilities/FormatHelpers/FormatHelpets'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const mapBillingDocumentRequisition = (
  raw: unknown,
): BillingDocumentRequisition => {
  const document = isRecord(raw) ? raw : {}

  return {
    billingdocument_id: String(document.billingdocument_id ?? ''),
    billingimages_id: (document.billingimages_id as string | null | undefined) ?? null,
    category: (document.category as string | null | undefined) ?? null,
    description: (document.description as string | null | undefined) ?? null,
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
  const billingData = isRecord(raw) && isRecord(raw.billingRequisition)
    ? raw.billingRequisition
    : isRecord(raw)
      ? raw
      : {}

  const documents = isRecord(raw) && Array.isArray(raw.billingDocumentRquisition)
    ? raw.billingDocumentRquisition
    : []

  return {
    billingrequisition_id: String(billingData.billingrequisition_id ?? ''),
    requisitionkey: String(billingData.requisitionkey ?? ''),
    id_Employee: String(billingData.employee_id ?? ''),
    employeename: String(billingData.employeename ?? ''),
    idProject: String(billingData.idproject ?? ''),
    projectname: String(billingData.projectname ?? ''),
    assignmentdate: toInputDateString(billingData.assignmentdate) ?? '',
    endDate: toInputDateString(billingData.enddate) ?? '',
    motive: String(billingData.motive ?? ''),
    state: String(billingData.state ?? ''),
    amountdeposited: String(billingData.amountdeposited ?? ''),
    provenamount: String(billingData.provenamount ?? ''),
    amountdifference: String(billingData.amountdifference ?? ''),
    date_created: String(billingData.date_created ?? ''),
    status: String(billingData.status ?? ''),
    gts_type: String(billingData.gts_type ?? ''),
    email: String(billingData.email ?? ''),
    phone_number: String(billingData.phone_number ?? ''),
    period: String(billingData.period ?? ''),
    current_days: Number(billingData.current_days ?? 0),
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
})
