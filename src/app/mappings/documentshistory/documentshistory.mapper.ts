import { BillingDocumentMap } from "@/app/mappings/billingdocuments/billingdocuments.mapper"
import type {
  BillingDocumentJsonSapItem,
  BillingDocuments,
} from "@/app/mappings/billingdocuments/billingdocuments.types"
import type {
  DocumentHistoryConcept,
  DocumentHistoryDetail,
  DocumentsHistoryListItem,
  DocumentsHistoryPage,
  DocumentsHistoryQuery,
} from "@/app/shared/documentshistory/types"

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null

const toStringSafe = (value: unknown, fallback = "") =>
  value == null ? fallback : String(value)

const toNumberSafe = (value: unknown, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const toOptionalNumber = (value: unknown) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

const unwrapDocument = (raw: unknown) => {
  if (!isRecord(raw)) return {}
  if (isRecord(raw.document)) return raw.document
  if (isRecord(raw.item)) return raw.item
  return raw
}

const mapBillingDocument = (raw: unknown): BillingDocuments => {
  const source = unwrapDocument(raw)
  const parent = isRecord(raw) ? raw : {}

  return BillingDocumentMap({
    ...source,
    authorization: parent.authorization ?? source.authorization ?? null,
  })
}

const firstText = (...values: unknown[]) =>
  values.map((value) => toStringSafe(value).trim()).find(Boolean) ?? ""

const pickEmployeeName = (raw: Record<string, any>, document: BillingDocuments) =>
  firstText(
    raw.employeename,
    raw.employee_name,
    raw.employeeName,
    raw.requisition?.employeename,
    document.requisition?.employeename,
  )

const pickCompanyName = (raw: Record<string, any>, document: BillingDocuments) =>
  firstText(
    raw.companyname,
    raw.companyName,
    raw.enterprice_name,
    raw.enterprise?.name,
    raw.company?.name,
    raw.requisition?.companyname,
    raw.requisition?.companyName,
    raw.requisition?.enterprice_name,
    raw.requisition?.enterprise?.name,
    raw.rfc_receptor,
    document.rfc_receptor,
  )

const pickProjectName = (raw: Record<string, any>, document: BillingDocuments) =>
  firstText(
    raw.projectname,
    raw.projectName,
    raw.project?.name,
    raw.requisition?.projectname,
    document.requisition?.projectname,
  )

const pickRequisitionCode = (
  raw: Record<string, any>,
  document: BillingDocuments,
) =>
  firstText(
    raw.requisitionkey,
    raw.requisitionKey,
    raw.code_number,
    raw.requisition?.requisitionkey,
    document.requisition?.requisitionkey,
  )

const pickCertificationDate = (
  raw: Record<string, any>,
  document: BillingDocuments,
) =>
  firstText(
    raw.certification_date,
    raw.certificationDate,
    raw.fecha,
    document.fecha,
    raw.date_created,
    document.date_created,
  )

const mapConcept = (concept: any, index: number): DocumentHistoryConcept => ({
  id: `${toStringSafe(concept?.clave_sat, "concept")}-${index}`,
  satKey: toStringSafe(concept?.clave_sat),
  description: toStringSafe(
    concept?.clavesat_description ?? concept?.description,
  ),
  quantity: Number.isFinite(Number(concept?.cantidad))
    ? Number(concept?.cantidad)
    : undefined,
  unitValue: Number.isFinite(Number(concept?.valor_unitario))
    ? Number(concept?.valor_unitario)
    : undefined,
  amount: Number.isFinite(Number(concept?.importe))
    ? Number(concept?.importe)
    : undefined,
  taxPercentage: Number.isFinite(Number(concept?.porcentajeiva))
    ? Number(concept?.porcentajeiva)
    : undefined,
  expenseType: toStringSafe(concept?.tipo_gasto),
  ivaGroup: toStringSafe(concept?.grupo_iva),
})

const mapJsonSapConcept = (
  concept: BillingDocumentJsonSapItem,
  index: number,
): DocumentHistoryConcept => {
  const taxRate = toOptionalNumber(concept?.tasaCuota)
  const taxPercentage =
    taxRate != null ? Number((taxRate * 100).toFixed(2)) : undefined

  return {
    id: `${toStringSafe(concept?.claveProdServ, "json-sap-concept")}-${index}`,
    satKey: toStringSafe(concept?.claveProdServ),
    description: toStringSafe(concept?.descripcion),
    amount: toOptionalNumber(concept?.importe),
    taxPercentage,
    expenseType: toStringSafe(concept?.claveInterna),
    ivaGroup: toStringSafe(concept?.impuesto),
  }
}

const mapListItem = (raw: unknown): DocumentsHistoryListItem => {
  const source = unwrapDocument(raw)
  const mapped = mapBillingDocument(raw)

  return {
    id: toStringSafe(mapped.billingdocument_id || source.id),
    employeeName: pickEmployeeName(source, mapped),
    companyName: pickCompanyName(source, mapped),
    projectName: pickProjectName(source, mapped),
    requisitionCode: pickRequisitionCode(source, mapped),
    uuid: toStringSafe(mapped.uuid),
    status: toStringSafe(mapped.status),
    xmlUrl: mapped.xml || null,
    pdfUrl: mapped.pdf || null,
    imageUrl: mapped.image || null,
  }
}

const mapDetail = (raw: unknown): DocumentHistoryDetail => {
  const source = unwrapDocument(raw)
  const mapped = mapBillingDocument(raw)
  const jsonSapConcepts = Array.isArray(mapped.json_sap?.items)
    ? mapped.json_sap.items.map(mapJsonSapConcept)
    : []
  const legacyConcepts = Array.isArray(mapped.conceptos)
    ? mapped.conceptos.map(mapConcept)
    : []

  return {
    ...mapListItem(raw),
    certificationDate: pickCertificationDate(source, mapped),
    rfcEmisor: toStringSafe(mapped.rfc_emisor),
    rfcReceptor: toStringSafe(mapped.rfc_receptor),
    subtotal: toNumberSafe(mapped.subtotal),
    iva: toNumberSafe(mapped.iva),
    total: toNumberSafe(mapped.total),
    comments: toStringSafe(mapped.comments),
    userComments: toStringSafe(mapped.user_comments),
    concepts: jsonSapConcepts.length > 0 ? jsonSapConcepts : legacyConcepts,
  }
}

const extractCollection = (raw: unknown): unknown[] => {
  if (Array.isArray(raw)) return raw
  if (!isRecord(raw)) return []

  const directCandidates = [
    raw.items,
    raw.results,
    raw.rows,
    raw.records,
    raw.documents,
    raw.data,
  ]

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }
  }

  if (isRecord(raw.data)) {
    return extractCollection(raw.data)
  }

  return []
}

const extractMetaValue = (
  raw: unknown,
  fieldNames: string[],
): unknown => {
  if (!isRecord(raw)) return undefined

  for (const fieldName of fieldNames) {
    if (raw[fieldName] != null) return raw[fieldName]
  }

  if (isRecord(raw.pagination)) {
    const nested: unknown = extractMetaValue(raw.pagination, fieldNames)
    if (nested != null) return nested
  }

  if (isRecord(raw.meta)) {
    const nested: unknown = extractMetaValue(raw.meta, fieldNames)
    if (nested != null) return nested
  }

  if (isRecord(raw.data)) {
    return extractMetaValue(raw.data, fieldNames)
  }

  return undefined
}

export const DocumentsHistoryPageMap = (
  raw: unknown,
  fallbackQuery: DocumentsHistoryQuery,
): DocumentsHistoryPage => {
  const items = extractCollection(raw).map(mapListItem)
  const totalRows = toNumberSafe(
    extractMetaValue(raw, [
      "totalRows",
      "totalRecords",
      "total",
      "count",
      "totalCount",
    ]),
    items.length,
  )
  const page = toNumberSafe(
    extractMetaValue(raw, ["page", "pageNumber", "currentPage"]),
    fallbackQuery.page,
  )
  const pageSize = toNumberSafe(
    extractMetaValue(raw, ["pageSize", "perPage", "itemsPerPage"]),
    fallbackQuery.pageSize,
  )

  return {
    items,
    totalRows,
    page,
    pageSize,
  }
}

export const DocumentHistoryDetailMap = (
  raw: unknown,
): DocumentHistoryDetail | null => {
  if (!raw) return null

  const candidate = isRecord(raw) && raw.data != null ? raw.data : raw
  if (!candidate) return null

  return mapDetail(candidate)
}
