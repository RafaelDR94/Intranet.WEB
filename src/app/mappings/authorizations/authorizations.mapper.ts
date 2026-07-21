import { mapEmployee } from '../employees/employee.mapper'
import { mapEnterprise } from '../enterprises/enterprises.mapper'
import { ProyectMap } from '../proyects/proyects.mapper'
import type { Department } from '../enterprises/enterprises.types'
import type {
  Authorization,
  AuthorizationStatus,
  AuthorizationType,
  PostAuthorization,
  PutAuthorizer,
  PutStatusAuthorization,
  StatusAuthorization,
} from './authorizations.types'

const toString = (value: unknown, fallback = ''): string =>
  value == null ? fallback : String(value)

const toOptionalString = (value: unknown): string | undefined => {
  if (value == null) return undefined
  const str = String(value)
  return str.trim() === '' ? undefined : str
}

const pickStatusText = (value: unknown): string => {
  if (value && typeof value === 'object') {
    const src = value as Record<string, unknown>
    const raw = src.name ?? src.status ?? src.authorization_status ?? src.state
    return raw == null ? '' : String(raw)
  }

  return value == null ? '' : String(value)
}

const toStatusAuthorization = (value: unknown): StatusAuthorization => {
  const status = pickStatusText(value).trim()
  switch (status) {
    case 'Pendiente':
    case 'Aprobada':
    case 'Rechazada':
    case 'Cancelada':
      return status
    default:
      return 'Pendiente'
  }
}

const mapAuthorizationStatus = (value: unknown): AuthorizationStatus => {
  if (value && typeof value === 'object') {
    const src = value as Record<string, unknown>
    return {
      id: toString(src.id ?? src.status_id ?? src.statusId),
      name: toString(
        src.name ??
          src.status_name ??
          src.status ??
          src.authorization_status ??
          src.state,
      ),
      type: toString(src.type ?? src.status_type ?? 'Authorization'),
      is_active: Boolean(src.is_active ?? src.isActive ?? true),
    }
  }

  const name = toString(value).trim()
  return {
    id: '',
    name: name || 'Pendiente',
    type: 'Authorization',
    is_active: true,
  }
}

const mapEmployeeFromRaw = (raw: unknown, fallbackId = '') => {
  if (raw && typeof raw === 'object') return mapEmployee(raw)

  return mapEmployee({
    employee_id: fallbackId,
    firstname: '',
    secondname: '',
    lastname: '',
    motherlast_name: '',
    gender: '',
    email: '',
    phone_number: '',
    extension: '',
    image_url: '',
    manager_id: '',
    department: {},
    workposition: {},
    user: null,
    is_active: true,
  })
}

const mapEnterpriseFromRaw = (raw: unknown, fallbackId = '') => {
  if (raw && typeof raw === 'object') return mapEnterprise(raw)

  return mapEnterprise({
    enterprise_id: fallbackId,
    name: '',
    departments: [],
    is_external: false,
  })
}

const mapDepartmentFromRaw = (raw: unknown): Department | undefined => {
  if (!raw || typeof raw !== 'object') return undefined
  const src = raw as Record<string, unknown>

  return {
    department_id: toString(src.department_id ?? src.id),
    name: toString(src.name),
    enterprise_id: toString(src.enterprise_id ?? src.enterpriseId),
    enterprice_name: toString(src.enterprice_name ?? src.enterprise_name ?? src.enterpriseName),
  }
}

/**
 * mapAuthorization
 * Mapea un registro crudo de la API a un objeto Authorization tipado.
 */
export const mapAuthorization = (raw: unknown): Authorization => {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const applicantId = toString(src.applicant_id ?? src.applicantId)
  const authorizerId = toString(src.authorizer_id ?? src.authorizerId)
  const enterpriseId = toString(src.enterprise_id ?? src.enterpriseId)


  return {
    authorization_id: toString(src.authorization_id ?? src.id),
    applicant: mapEmployeeFromRaw(src.applicant ?? src.employee ?? src.applicantInfo, applicantId),
    authorizer: mapEmployeeFromRaw(
      src.authorizer ?? src.authorizerInfo ?? src.authorizer_employee,
      authorizerId,
    ),
    enterprise: mapEnterpriseFromRaw(src.enterprise ?? src.enterpriseInfo, enterpriseId),
    department: mapDepartmentFromRaw(src.department ?? src.Department),
    kind: mapAuthorizationType(src.kind),
    dateCreated: toString(src.dateCreated ?? src.date_created ?? src.created_at ?? src.createdAt),
    status: mapAuthorizationStatus(src.status ?? src.authorization_status ?? src.state),
    proyect: ProyectMap(src.proyect ?? src.project ?? src.proyect_id ?? src.project_id),
    event_id: toString(src.event_id ?? src.eventId),
    comment: toOptionalString(src.comment ?? src.comments ?? src.authorization_comment),
    raw: src,
  }
}

/**
 * mapAuthorizations
 * Mapea una lista cruda de la API a un arreglo de Authorization.
 */
export const mapAuthorizations = (list: unknown[]): Authorization[] =>
  Array.isArray(list) ? list.map(mapAuthorization) : []

/**
 * mapAuthorizationType
 * Mapea un registro crudo de la API a un AuthorizationType.
 */
export const mapAuthorizationType = (raw: unknown): AuthorizationType => {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    id: toString(src.id ?? src.authorization_type_id ?? src.kind_id),
    name: toString(src.name ?? src.kind_name ?? src.authorization_type_name),
  }
}

export const mapAuthorizationTypes = (list: unknown[]): AuthorizationType[] =>
  Array.isArray(list) ? list.map(mapAuthorizationType) : []

/**
 * mapPostAuthorization
 * Construye el payload para crear una autorización (POST).
 */
export const mapPostAuthorization = (
  payload: Partial<PostAuthorization> | Record<string, unknown>,
): PostAuthorization => ({
  authorization_id: toString(payload.authorization_id),
  applicant_id: toString(payload.applicant_id),
  authorizer_id: toString(payload.authorizer_id),
  enterprise_id: toString(payload.enterprise_id),
  department_id: toString(payload.department_id),
  kind: toString(payload.kind),
  proyect_id: toOptionalString(payload.proyect_id),
  event_id: toString(payload.event_id),
  comments: toOptionalString((payload as Record<string, unknown>).comments ?? (payload as Record<string, unknown>).comment),
})

/**
 * mapPutAuthorizationStatus
 * Construye el payload para actualizar el estatus de una autorización.
 */
export const mapPutAuthorizationStatus = (
  payload: Partial<PutStatusAuthorization> | Record<string, unknown>,
): PutStatusAuthorization => ({
  status: toStatusAuthorization(payload.status),
})

/**
 * mapPutAuthorizationAuthorizer
 * Construye el payload para actualizar el autorizador de una autorización.
 */
export const mapPutAuthorizationAuthorizer = (
  payload: Partial<PutAuthorizer> | Record<string, unknown>,
): PutAuthorizer => ({
  authorizer_id: toString(payload.authorizer_id),
})
