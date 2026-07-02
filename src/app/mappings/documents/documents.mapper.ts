import { formatDateOnlyDate } from '@/app/utilities/DatesHelper/Dateshelper'

import type {
  DepartmentSummary,
  DocumentTypeSummary,
  ManagementDocument,
  ManagementDocumentTableRow,
} from './documents.types'

const normalizeString = (value: unknown): string => {
  if (value == null) return ''
  return String(value)
}

const normalizeBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false
  }
  if (typeof value === 'number') return value === 1
  return Boolean(value)
}

const toTimestamp = (value: unknown): number => {
  if (value == null) return Number.NEGATIVE_INFINITY
  const normalized = String(value).trim()
  if (!normalized) return Number.NEGATIVE_INFINITY

  const parsed = Date.parse(normalized)
  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed
}

const sortTableRowsByMostRecent = (
  left: ManagementDocumentTableRow,
  right: ManagementDocumentTableRow,
) => {
  const leftTimestamp = toTimestamp(left.rawDate ?? left.datecreated ?? left.date)
  const rightTimestamp = toTimestamp(right.rawDate ?? right.datecreated ?? right.date)

  return rightTimestamp - leftTimestamp
}

export const mapDocumentTypeSummary = (raw: any): DocumentTypeSummary => ({
  document_type_id: normalizeString(raw?.document_type_id ?? raw?.id),
  name: normalizeString(raw?.name),
  description: normalizeString(raw?.description),
  is_active: normalizeBoolean(raw?.is_active ?? raw?.isActive),
})

export const mapDocumentTypes = (rawList: any): DocumentTypeSummary[] => {
  if (!Array.isArray(rawList)) return []
  return rawList.map(mapDocumentTypeSummary)
}

export const mapDocumentTypesToOptions = (
  documentTypes: DocumentTypeSummary[],
): { label: string; value: string }[] =>
  documentTypes.map((documentType) => ({
    label: documentType.name,
    value: documentType.document_type_id,
  }))

export const mapDepartmentSummary = (raw: any): DepartmentSummary => ({
  department_id: normalizeString(raw?.department_id ?? raw?.idDepartment ?? raw?.id),
  name: normalizeString(raw?.name),
  enterprise_id: normalizeString(raw?.enterprise_id ?? raw?.enterpriseId ?? raw?.enterprise?.id),
  enterprice_name: normalizeString(
    raw?.enterprice_name ?? raw?.enterprise_name ?? raw?.enterprise?.name ?? '',
  ),
})

const mapDepartmentsList = (raw: any): DepartmentSummary[] => {
  if (!raw) return []

  const items = Array.isArray(raw) ? raw : [raw]

  return items
    .map((item) => mapDepartmentSummary(item ?? {}))
    .filter((department) => Boolean(department.department_id))
}

export const mapManagementDocument = (raw: any): ManagementDocument => {
  const documentType = mapDocumentTypeSummary(raw?.document_type ?? raw?.documentType ?? {})
  const rawDepartments =
    raw?.departments ?? raw?.Departments ?? raw?.department ?? raw?.Department ?? []
  const departments = mapDepartmentsList(rawDepartments)
  const department =
    departments[0] ?? mapDepartmentSummary(raw?.department ?? raw?.Department ?? {})

  return {
    document_id: normalizeString(raw?.document_id ?? raw?.id),
    name: normalizeString(raw?.name),
    datecreated: normalizeString(
      raw?.datecreated ?? raw?.created_at ?? raw?.createdAt ?? raw?.date ?? raw?.fecha ?? '',
    ),
    code: normalizeString(raw?.code),
    description: normalizeString(raw?.description),
    document_type: documentType,
    department: department.department_id ? department : undefined,
    departments,
    management: normalizeBoolean(raw?.management ?? raw?.is_management ?? false),
    route: normalizeString(raw?.route ?? raw?.url ?? raw?.download_url),
    extension: normalizeString(raw?.extension ?? raw?.file_extension ?? ''),
    created_at: normalizeString(
      raw?.created_at ?? raw?.createdAt ?? raw?.date ?? raw?.fecha ?? raw?.upload_date ?? '',
    ) || undefined,
    updated_at:
      normalizeString(raw?.updated_at ?? raw?.updatedAt ?? raw?.modified_at ?? '') || undefined,
    published_at:
      normalizeString(
        raw?.published_at ?? raw?.publishedAt ?? raw?.publication_date ?? raw?.publicated_at ?? '',
      ) || undefined,
  }
}

export const mapManagementDocuments = (rawList: any): ManagementDocument[] => {
  if (!Array.isArray(rawList)) return []
  return rawList.map(mapManagementDocument)
}

export const mapManagementDocumentToTableRow = (
  doc: ManagementDocument,
): ManagementDocumentTableRow => {
  const rawDate =
    doc.published_at || doc.updated_at || doc.created_at || ''
  const primaryDepartment = doc.departments?.[0]?.name || doc.department?.name || ''

  return {
    id: doc.document_id,
    name: doc.name,
    datecreated: doc.datecreated,
    code: doc.code,
    description: doc.description,
    documentType: doc.document_type?.name ?? '',
    department: primaryDepartment,
    extension: doc.extension,
    route: doc.route,
    rawDate: rawDate || undefined,
    date: rawDate ? formatDateOnlyDate(rawDate) : '',
  }
}

export const mapManagementDocumentsToTableRows = (
  docs: ManagementDocument[],
): ManagementDocumentTableRow[] =>
  docs
    .filter((doc) => doc.management)
    .map(mapManagementDocumentToTableRow)
    .sort(sortTableRowsByMostRecent)

export const mapOperationalDocumentsToTableRows = (
  docs: ManagementDocument[],
): ManagementDocumentTableRow[] =>
  docs
    .filter((doc) => !doc.management)
    .map(mapManagementDocumentToTableRow)
    .sort(sortTableRowsByMostRecent)
