export type DocumentTypeSummary = {
  document_type_id: string
  name: string
  description: string
  is_active: boolean
}

export type DepartmentSummary = {
  department_id: string
  name: string
  enterprise_id: string
  enterprice_name: string
}

export type ManagementDocument = {
  document_id: string
  name: string
  code: string
  description: string
  document_type: DocumentTypeSummary
  department: DepartmentSummary
  management: boolean
  route: string
  extension: string
  created_at?: string
  updated_at?: string
  published_at?: string
}

/**
 * Payload requerido por el endpoint de creación de documentos.
 */
export type DocumentPostPayload = {
  name: string
  code: string
  description: string
  document_type_id: string
  department_id: string
  management: boolean
  route: string
  extension: string
}

export type ManagementDocumentTableRow = {
  id: string
  name: string
  code: string
  description: string
  documentType: string
  department: string
  extension: string
  route: string
  date: string
  rawDate?: string
}
