import type { Department, Enterprise } from '../enterprises/enterprises.types'

import type {
  DevicesAssignedFilters,
  InternalDevice,
  InternalDeviceAssignment,
  InternalDeviceAssignmentPost,
  InternalDeviceAssignmentPut,
  InternalDeviceAssignmentHistory,
  InternalDeviceBrand,
  InternalDeviceBrandPost,
  InternalDeviceBrandPut,
  InternalDevicePost,
  InternalDeviceProyect,
  InternalDevicePut,
  InternalDeviceReview,
  InternalDeviceReviewPost,
  InternalDeviceReviewPut,
  InternalDeviceStatus,
  InternalDeviceStatusPost,
  InternalDeviceStatusPut,
  InternalDeviceType,
  InternalDeviceTypePost,
  InternalDeviceTypePut,
} from './internaldevices.types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toRecord = (value: unknown): Record<string, unknown> =>
  (isRecord(value) ? value : {})

const toString = (value: unknown, fallback = ''): string =>
  value == null ? fallback : String(value)

const toNullableString = (value: unknown): string | null =>
  value == null ? null : String(value)

const toBoolean = (value: unknown, fallback = false): boolean =>
  value == null ? fallback : Boolean(value)

const toNullableId = (value: unknown): string | null => {
  if (value == null) return null
  const str = String(value).trim()
  return str ? str : null
}

const mapEnterpriseDepartment = (raw: unknown): Department => {
  const record = toRecord(raw)
  return {
    department_id: toString(record.department_id ?? record.id),
    name: toString(record.name),
    enterprise_id: toString(record.enterprise_id ?? record.enterpriseId),
    enterprice_name: toString(
      record.enterprice_name ?? record.enterprise_name ?? record.enterpriseName,
    ),
  }
}

export const InternalDeviceEnterpriseMap = (raw: unknown): Enterprise => {
  const record = toRecord(raw)
  return {
    enterprise_id: toString(record.enterprise_id ?? record.id),
    name: toString(record.name),
    is_external: toBoolean(record.is_external),
    departments: Array.isArray(record.departments)
      ? record.departments.map(mapEnterpriseDepartment)
      : [],
  }
}

export const InternalDeviceTypeMap = (raw: unknown): InternalDeviceType => {
  const record = toRecord(raw)
  return {
    device_type_id: toString(record.device_type_id ?? record.id),
    name: toString(record.name),
    description: toString(record.description),
    is_active: toBoolean(record.is_active),
  }
}

export const InternalDeviceTypesMap = (list: unknown[]): InternalDeviceType[] =>
  Array.isArray(list) ? list.map(InternalDeviceTypeMap) : []

export const InternalDeviceBrandMap = (raw: unknown): InternalDeviceBrand => {
  const record = toRecord(raw)
  return {
    device_brand_id: toString(record.device_brand_id ?? record.id),
    name: toString(record.name),
    description: toString(record.description),
    is_active: toBoolean(record.is_active),
  }
}

export const InternalDeviceBrandsMap = (
  list: unknown[],
): InternalDeviceBrand[] =>
  Array.isArray(list) ? list.map(InternalDeviceBrandMap) : []

export const InternalDeviceStatusMap = (raw: unknown): InternalDeviceStatus => {
  const record = toRecord(raw)
  return {
    device_status_id: toString(record.device_status_id ?? record.id),
    name: toString(record.name),
    description: toString(record.description),
    is_active: toBoolean(record.is_active),
  }
}

export const InternalDeviceStatusesMap = (
  list: unknown[],
): InternalDeviceStatus[] =>
  Array.isArray(list) ? list.map(InternalDeviceStatusMap) : []

export const InternalDeviceProyectMap = (
  raw: unknown,
): InternalDeviceProyect => {
  const record = toRecord(raw)
  return {
    id: toString(record.id ?? record.proyect_id ?? record.proyectId),
    name: toString(record.name),
    proyectkey: toString(record.proyectkey ?? record.proyectKey),
    client: toString(record.client),
  }
}

export const InternalDeviceMap = (raw: unknown): InternalDevice => {
  const record = toRecord(raw)
  const typeRaw = record.device_type ?? record.deviceType
  const brandRaw = record.device_brand ?? record.deviceBrand
  const statusRaw = record.device_status ?? record.deviceStatus
  const proyectRaw = record.device_proyect ?? record.deviceProyect
  const enterpriseRaw = record.enterprise

  return {
    device_id: toString(record.device_id ?? record.id),
    name: toString(record.name),
    model: toString(record.model),
    serial_number: toString(record.serial_number ?? record.serialNumber),
    ip_address: toString(record.ip_address ?? record.ipAddress),
    mac_address: toString(record.mac_address ?? record.macAddress),
    mac_wifi_address: toString(
      record.mac_wifi_address ?? record.macWifiAddress,
    ),
    operating_system: toString(
      record.operating_system ?? record.operatingSystem,
    ),
    charge_sn: toString(record.charge_sn ?? record.chargeSn),
    description: toString(record.description),
    low_motive: toString(record.low_motive ?? record.lowMotive),
    assigned: toBoolean(record.assigned),
    assigned_to: toNullableString(
      record.assigned_to ??
        record.assignedTo ??
        record.assigned_employee ??
        record.assignedEmployee ??
        record.employee_name ??
        record.employeeName ??
        record.employeename ??
        record.user_name ??
        record.userName,
    ),
    device_type: isRecord(typeRaw) ? InternalDeviceTypeMap(typeRaw) : null,
    device_brand: isRecord(brandRaw) ? InternalDeviceBrandMap(brandRaw) : null,
    device_status: isRecord(statusRaw)
      ? InternalDeviceStatusMap(statusRaw)
      : null,
    device_proyect: isRecord(proyectRaw)
      ? InternalDeviceProyectMap(proyectRaw)
      : null,
    is_active: toBoolean(record.is_active),
    reviewed: toBoolean(record.reviewed),
    lowdate: toNullableString(record.lowdate),
    lowuser: toNullableString(record.lowuser),
    assurance: toString(record.assurance),
    enterprise: isRecord(enterpriseRaw)
      ? InternalDeviceEnterpriseMap(enterpriseRaw)
      : null,
  }
}

export const InternalDevicesMap = (list: unknown[]): InternalDevice[] =>
  Array.isArray(list) ? list.map(InternalDeviceMap) : []

const readNestedId = (raw: unknown, key: string): string | undefined => {
  if (!isRecord(raw)) return undefined
  const value = raw[key]
  if (value == null) return undefined
  return toString(value)
}

export const InternalDevicePostMap = (
  payload:
    | Partial<InternalDevicePost>
    | Partial<InternalDevice>
    | Record<string, unknown>,
): InternalDevicePost => {
  const record = toRecord(payload)
  const deviceTypeRaw = record.device_type ?? record.deviceType
  const deviceBrandRaw = record.device_brand ?? record.deviceBrand
  const enterpriseRaw = record.enterprise
  const proyectRaw = record.device_proyect ?? record.deviceProyect
  const resolvedProyectId =
    record.proyect_id ?? record.proyectId ?? readNestedId(proyectRaw, 'id')
  const normalizedProyectId = toNullableId(resolvedProyectId)

  return {
    name: toString(record.name),
    model: toString(record.model),
    serial_number: toString(record.serial_number ?? record.serialNumber),
    ip_address: toString(record.ip_address ?? record.ipAddress),
    mac_address: toString(record.mac_address ?? record.macAddress),
    mac_wifi_address: toString(
      record.mac_wifi_address ?? record.macWifiAddress,
    ),
    operating_system: toString(
      record.operating_system ?? record.operatingSystem,
    ),
    charge_sn: toString(record.charge_sn ?? record.chargeSn),
    description: toString(record.description),
    low_motive: toString(record.low_motive ?? record.lowMotive),
    assigned: toBoolean(record.assigned),
    reviewed: toBoolean(record.reviewed),
    device_type_id: toString(
      record.device_type_id ??
        record.deviceTypeId ??
        readNestedId(deviceTypeRaw, 'device_type_id') ??
        readNestedId(deviceTypeRaw, 'id'),
    ),
    device_brand_id: toString(
      record.device_brand_id ??
        record.deviceBrandId ??
        readNestedId(deviceBrandRaw, 'device_brand_id') ??
        readNestedId(deviceBrandRaw, 'id'),
    ),
    assurance: toString(record.assurance),
    id_enterprise: toString(
      record.id_enterprise ??
        record.enterprise_id ??
        record.idEnterprise ??
        readNestedId(enterpriseRaw, 'enterprise_id') ??
        readNestedId(enterpriseRaw, 'id'),
    ),
    proyect_id: normalizedProyectId,
  }
}

export const InternalDeviceViewPayloadMap = (
  payload:
    | Partial<InternalDevicePost>
    | Partial<InternalDevicePut>
    | Partial<InternalDevice>
    | Record<string, unknown>,
): Record<string, unknown> => {
  const record = toRecord(payload)
  const deviceTypeRaw = record.device_type ?? record.deviceType
  const deviceBrandRaw = record.device_brand ?? record.deviceBrand
  const deviceStatusRaw = record.device_status ?? record.deviceStatus
  const enterpriseRaw = record.enterprise

  return {
    DeviceId: toString(record.device_id ?? record.id),
    Name: toString(record.name),
    Model: toString(record.model),
    SerialNumber: toString(record.serial_number ?? record.serialNumber),
    IpAddress: toString(record.ip_address ?? record.ipAddress),
    MacAddress: toString(record.mac_address ?? record.macAddress),
    MacWifiAddress: toString(
      record.mac_wifi_address ?? record.macWifiAddress,
    ),
    OperatingSystem: toString(
      record.operating_system ?? record.operatingSystem,
    ),
    ChargeSN: toString(record.charge_sn ?? record.chargeSn),
    Description: toString(record.description),
    LowMotive: toString(record.low_motive ?? record.lowMotive),
    Assigned: toBoolean(record.assigned),
    Reviewed: toBoolean(record.reviewed),
    DeviceTypeId: toNullableId(
      record.device_type_id ??
        record.deviceTypeId ??
        readNestedId(deviceTypeRaw, 'device_type_id') ??
        readNestedId(deviceTypeRaw, 'id'),
    ),
    DeviceBrandId: toNullableId(
      record.device_brand_id ??
        record.deviceBrandId ??
        readNestedId(deviceBrandRaw, 'device_brand_id') ??
        readNestedId(deviceBrandRaw, 'id'),
    ),
    DeviceStatusId: toNullableId(
      record.device_status_id ??
        record.deviceStatusId ??
        readNestedId(deviceStatusRaw, 'device_status_id') ??
        readNestedId(deviceStatusRaw, 'id'),
    ),
    IsActive: toBoolean(record.is_active),
    Assurance: toString(record.assurance),
    IdEnterprise: toNullableId(
      record.id_enterprise ??
        record.enterprise_id ??
        record.idEnterprise ??
        readNestedId(enterpriseRaw, 'enterprise_id') ??
        readNestedId(enterpriseRaw, 'id'),
    ),
  }
}

export const InternalDevicePutMap = (
  payload:
    | Partial<InternalDevicePut>
    | Partial<InternalDevice>
    | Record<string, unknown>,
): InternalDevicePut => {
  const record = toRecord(payload)
  const deviceTypeRaw = record.device_type ?? record.deviceType
  const deviceBrandRaw = record.device_brand ?? record.deviceBrand
  const deviceStatusRaw = record.device_status ?? record.deviceStatus
  const enterpriseRaw = record.enterprise
  const proyectRaw = record.device_proyect ?? record.deviceProyect

  const resolvedProyectId =
    record.proyect_id ?? record.proyectId ?? readNestedId(proyectRaw, 'id')
  const normalizedProyectId = toNullableId(resolvedProyectId)

  return {
    device_id: toString(record.device_id ?? record.id),
    name: toString(record.name),
    model: toString(record.model),
    serial_number: toString(record.serial_number ?? record.serialNumber),
    ip_address: toString(record.ip_address ?? record.ipAddress),
    mac_address: toString(record.mac_address ?? record.macAddress),
    mac_wifi_address: toString(
      record.mac_wifi_address ?? record.macWifiAddress,
    ),
    operating_system: toString(
      record.operating_system ?? record.operatingSystem,
    ),
    charge_sn: toString(record.charge_sn ?? record.chargeSn),
    description: toString(record.description),
    low_motive: toString(record.low_motive ?? record.lowMotive),
    assigned: toBoolean(record.assigned),
    reviewed: toBoolean(record.reviewed),
    device_type_id: toString(
      record.device_type_id ??
        record.deviceTypeId ??
        readNestedId(deviceTypeRaw, 'device_type_id') ??
        readNestedId(deviceTypeRaw, 'id'),
    ),
    device_brand_id: toString(
      record.device_brand_id ??
        record.deviceBrandId ??
        readNestedId(deviceBrandRaw, 'device_brand_id') ??
        readNestedId(deviceBrandRaw, 'id'),
    ),
    device_status_id: toString(
      record.device_status_id ??
        record.deviceStatusId ??
        readNestedId(deviceStatusRaw, 'device_status_id') ??
        readNestedId(deviceStatusRaw, 'id'),
    ),
    is_active: toBoolean(record.is_active),
    assurance: toString(record.assurance),
    id_enterprise: toString(
      record.id_enterprise ??
        record.enterprise_id ??
        record.idEnterprise ??
        readNestedId(enterpriseRaw, 'enterprise_id') ??
        readNestedId(enterpriseRaw, 'id'),
    ),
    proyect_id: normalizedProyectId,
  }
}

export const InternalDeviceTypePostMap = (
  payload: Partial<InternalDeviceTypePost> | Record<string, unknown>,
): InternalDeviceTypePost => {
  const record = toRecord(payload)
  return {
    name: toString(record.name),
    description: toString(record.description),
  }
}

export const InternalDeviceTypePutMap = (
  payload: Partial<InternalDeviceTypePut> | Record<string, unknown>,
): InternalDeviceTypePut => {
  const record = toRecord(payload)
  return {
    device_type_id: toString(record.device_type_id ?? record.id),
    name: toString(record.name),
    description: toString(record.description),
  }
}

export const InternalDeviceBrandPostMap = (
  payload: Partial<InternalDeviceBrandPost> | Record<string, unknown>,
): InternalDeviceBrandPost => {
  const record = toRecord(payload)
  return {
    name: toString(record.name),
    description: toString(record.description),
  }
}

export const InternalDeviceBrandPutMap = (
  payload: Partial<InternalDeviceBrandPut> | Record<string, unknown>,
): InternalDeviceBrandPut => {
  const record = toRecord(payload)
  return {
    device_brand_id: toString(record.device_brand_id ?? record.id),
    name: toString(record.name),
    description: toString(record.description),
  }
}

export const InternalDeviceStatusPostMap = (
  payload: Partial<InternalDeviceStatusPost> | Record<string, unknown>,
): InternalDeviceStatusPost => {
  const record = toRecord(payload)
  return {
    name: toString(record.name),
    description: toString(record.description),
  }
}

export const InternalDeviceStatusPutMap = (
  payload: Partial<InternalDeviceStatusPut> | Record<string, unknown>,
): InternalDeviceStatusPut => {
  const record = toRecord(payload)
  return {
    device_status_id: toString(record.device_status_id ?? record.id),
    name: toString(record.name),
    description: toString(record.description),
  }
}

export const InternalDeviceReviewMap = (raw: unknown): InternalDeviceReview => {
  const record = toRecord(raw)
  return {
    device_review_id: toString(record.device_review_id ?? record.id),
    description: toString(record.description),
    device_id: toString(record.device_id ?? record.deviceId),
    user_id: toString(record.user_id ?? record.userId),
    status_id: toString(record.status_id ?? record.statusId),
    date: toNullableString(
      record.date ??
        record.created_at ??
        record.createdAt ??
        record.created_date ??
        record.date_created,
    ) ?? undefined,
    created_at: toNullableString(record.created_at ?? record.createdAt) ?? undefined,
    responsible: toNullableString(
      record.responsible ??
        record.user_name ??
        record.userName ??
        record.username ??
        record.employee_name,
    ) ?? undefined,
    user_name: toNullableString(
      record.user_name ?? record.userName ?? record.username,
    ) ?? undefined,
  }
}

export const InternalDeviceReviewsMap = (
  list: unknown[],
): InternalDeviceReview[] =>
  Array.isArray(list) ? list.map(InternalDeviceReviewMap) : []

export const InternalDeviceReviewPostMap = (
  payload: Partial<InternalDeviceReviewPost> | Record<string, unknown>,
): InternalDeviceReviewPost => {
  const record = toRecord(payload)
  return {
    description: toString(record.description),
    device_id: toString(record.device_id ?? record.deviceId),
    user_id: toString(record.user_id ?? record.userId),
    status_id: toString(record.status_id ?? record.statusId),
  }
}

export const InternalDeviceReviewPutMap = (
  payload: Partial<InternalDeviceReviewPut> | Record<string, unknown>,
): InternalDeviceReviewPut => {
  const record = toRecord(payload)
  return {
    device_review_id: toString(record.device_review_id ?? record.id),
    description: toString(record.description),
    device_id: toString(record.device_id ?? record.deviceId),
    user_id: toString(record.user_id ?? record.userId),
    status_id: toString(record.status_id ?? record.statusId),
  }
}

export const InternalDeviceAssignmentMap = (
  raw: unknown,
): InternalDeviceAssignment => {
  const record = toRecord(raw)
  const deviceRaw = record.device
  const employeeRaw = record.employee
  return {
    device_assigment_id: toString(record.device_assigment_id ?? record.id),
    observations: toString(record.observations),
    delivery_condition: toString(record.delivery_condition),
    device_id: toString(
      record.device_id ??
        record.deviceId ??
        readNestedId(deviceRaw, 'device_id') ??
        readNestedId(deviceRaw, 'id'),
    ),
    employee_id: toString(
      record.employee_id ??
        record.employeeId ??
        readNestedId(employeeRaw, 'employee_id') ??
        readNestedId(employeeRaw, 'id'),
    ),
    id_user: record.id_user ? toString(record.id_user) : undefined,
    date: toNullableString(
      record.date ??
        record.created_at ??
        record.createdAt ??
        record.assigned_at ??
        record.assignedAt,
    ) ?? undefined,
    created_at:
      toNullableString(record.created_at ?? record.createdAt) ?? undefined,
  }
}

export const InternalDeviceAssignmentsMap = (
  list: unknown[],
): InternalDeviceAssignment[] =>
  Array.isArray(list) ? list.map(InternalDeviceAssignmentMap) : []

export const InternalDeviceAssignmentHistoryMap = (
  raw: unknown,
): InternalDeviceAssignmentHistory => {
  const record = toRecord(raw)
  const dateCreated = toNullableString(
    record.datecreated ??
      record.date_created ??
      record.dateCreated ??
      record.created_at ??
      record.createdAt,
  )
  return {
    device_assigment_id: toString(record.device_assigment_id ?? record.id),
    devicename: toNullableString(record.devicename ?? record.device_name ?? record.deviceName) ?? undefined,
    model: toNullableString(record.model) ?? undefined,
    typedevice: toNullableString(
      record.typedevice ?? record.device_type ?? record.deviceType,
    ) ?? undefined,
    devicebrand: toNullableString(
      record.devicebrand ?? record.device_brand ?? record.deviceBrand,
    ) ?? undefined,
    description: toNullableString(record.description) ?? undefined,
    observations: toString(record.observations),
    delivery_condition: toString(record.delivery_condition),
    device_id: toString(record.device_id ?? record.deviceId),
    employee_id: toString(record.employee_id ?? record.employeeId),
    employeename: toNullableString(
      record.employeename ?? record.employee_name ?? record.employeeName,
    ) ?? undefined,
    assigned_to: toNullableString(
      record.assigned_to ??
        record.assignedTo ??
        record.employee_name ??
        record.employeeName ??
        record.employeename ??
        record.user_name ??
        record.userName ??
        record.username,
    ) ?? undefined,
    datecreated: dateCreated ?? undefined,
    createdBy: toNullableString(
      record.createdBy ?? record.created_by ?? record.createdby ?? record.createdByUser,
    ) ?? undefined,
    assigned: record.assigned == null ? undefined : toBoolean(record.assigned),
    date:
      toNullableString(
        record.date ??
          record.assigned_at ??
          record.assignedAt,
      ) ??
      dateCreated ??
      undefined,
    created_at: dateCreated ?? undefined,
  }
}

export const InternalDeviceAssignmentsHistoryMap = (
  list: unknown[],
): InternalDeviceAssignmentHistory[] =>
  Array.isArray(list) ? list.map(InternalDeviceAssignmentHistoryMap) : []

export const InternalDeviceAssignmentPostMap = (
  payload: Partial<InternalDeviceAssignmentPost> | Record<string, unknown>,
): InternalDeviceAssignmentPost => {
  const record = toRecord(payload)
  return {
    observations: toString(record.observations),
    delivery_condition: toString(record.delivery_condition),
    device_id: toString(record.device_id ?? record.deviceId),
    employee_id: toString(record.employee_id ?? record.employeeId),
    id_user: toString(record.id_user ?? record.idUser),
  }
}

export const InternalDeviceAssignmentPutMap = (
  payload: Partial<InternalDeviceAssignmentPut> | Record<string, unknown>,
): InternalDeviceAssignmentPut => {
  const record = toRecord(payload)
  return {
    device_assigment_id: toString(record.device_assigment_id ?? record.id),
    observations: toString(record.observations),
    delivery_condition: toString(record.delivery_condition),
    device_id: toString(record.device_id ?? record.deviceId),
    employee_id: toString(record.employee_id ?? record.employeeId),
  }
}

export const normalizeAssignedFilters = (
  filters?: DevicesAssignedFilters,
): DevicesAssignedFilters => ({
  isActive: filters?.isActive,
  isAssigned: filters?.isAssigned,
  isReviewed: filters?.isReviewed,
})
