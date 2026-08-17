import type { EmployeeType } from '@/app/mappings/employees/employee.types'
import type { InternalDeviceAssignmentHistory } from '@/app/mappings/internaldevices/internaldevices.types'
import type { UserEmployeeSummary, UserType } from '@/app/mappings/users/user.types'

import type {
  ActivatedUserRow,
  AssignedUserDevice,
  UserAccountDetailData,
} from '../types'

const NOT_AVAILABLE = 'No disponible'
const NOT_ASSIGNED = 'Sin asignar'

const buildActivatedUserSearchContent = (
  row: Omit<ActivatedUserRow, 'searchContent'>,
) =>
  [
    row.fullname,
    row.department,
    row.position,
    row.employeeNumber,
    row.statusLabel,
    row.fingerprintLabel,
  ]
    .filter(Boolean)
    .join(' ')

export const mapEmployeeSummaryToActivatedUserRow = (
  employee: UserEmployeeSummary,
): ActivatedUserRow => {
  const row: Omit<ActivatedUserRow, 'searchContent'> = {
    id: employee.employee_id,
    fullname: employee.fullname,
    avatarUrl: employee.image_url || undefined,
    department: employee.department,
    position: employee.workposition,
    employeeNumber: employee.employee_number,
    isActive: true,
    hasFingerprint: employee.dr_fingerprint,
    statusLabel: 'Activo',
    fingerprintLabel: employee.dr_fingerprint
      ? 'Con huella activa'
      : 'Sin huella activa',
  }

  return {
    ...row,
    searchContent: buildActivatedUserSearchContent(row),
  }
}

export const mapEmployeeSummaryToUserAccountDetailData = (
  employee: UserEmployeeSummary,
): UserAccountDetailData => {
  const row = mapEmployeeSummaryToActivatedUserRow(employee)

  return {
    ...row,
    userId: '',
    company: NOT_AVAILABLE,
    statusLabel: 'Activo',
    avatarUrl: employee.image_url || undefined,
    username: NOT_AVAILABLE,
    userRoleId: '',
    twoFactorEnabled: false,
    changePasswordOnNextLogin: false,
    managerialPermissions: false,
    businessPhone: NOT_AVAILABLE,
    provisionalPassword: NOT_AVAILABLE,
    phone: NOT_AVAILABLE,
    email: NOT_AVAILABLE,
    roleName: NOT_ASSIGNED,
    departmentLabel: employee.department,
    positionLabel: employee.workposition,
    assignedDevices: [],
  }
}

const joinDeviceDescription = (...values: Array<string | undefined>) =>
  values
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(' ')

export const mapAssignedDevices = (
  devices: InternalDeviceAssignmentHistory[],
): AssignedUserDevice[] =>
  devices.map((device, index) => ({
    id: device.device_assigment_id || `${device.device_id}-${index}`,
    typeLabel: device.typedevice?.trim() || NOT_ASSIGNED,
    description:
      joinDeviceDescription(device.devicebrand, device.model) || NOT_ASSIGNED,
  }))

export const mapEmployeeToUserAccountDetailData = (
  employee: EmployeeType,
  summary?: UserEmployeeSummary | null,
  userDetail?: UserType | null,
  assignedDevices: AssignedUserDevice[] = [],
): UserAccountDetailData => {
  const effectiveUser = userDetail ?? employee.user
  const primaryRole = effectiveUser?.role ?? effectiveUser?.roles?.[0] ?? null
  const roleName = primaryRole?.name?.trim() || NOT_ASSIGNED
  const hasFingerprint = employee.dr_fingerprint ?? summary?.dr_fingerprint ?? false
  const userIsActive = effectiveUser?.is_active ?? false

  const rowData: Omit<UserAccountDetailData, 'searchContent'> = {
    id: employee.employee_id,
    userId: effectiveUser?.user_id ?? '',
    fullname: employee.fullname,
    avatarUrl: employee.image_url || undefined,
    department: employee.department?.name ?? NOT_AVAILABLE,
    position:
      employee.workposition?.name ??
      employee.workposition_name ??
      NOT_AVAILABLE,
    employeeNumber: employee.employee_number,
    isActive: userIsActive,
    hasFingerprint,
    statusLabel: userIsActive ? 'Activo' : 'Desactivado',
    fingerprintLabel: hasFingerprint
      ? 'Con huella activa'
      : 'Sin huella activa',
    company: employee.department?.enterprice_name ?? NOT_AVAILABLE,
    username: effectiveUser?.username ?? NOT_AVAILABLE,
    userRoleId:
      effectiveUser?.role_id ??
      effectiveUser?.role?.id ??
      effectiveUser?.roles?.[0]?.id ??
      '',
    twoFactorEnabled: effectiveUser?.two_factor_enabled ?? false,
    changePasswordOnNextLogin: effectiveUser?.change_password ?? false,
    managerialPermissions: employee.is_gerence,
    businessPhone:
      employee.extension || employee.phone_number || employee.employee_phone,
    provisionalPassword: NOT_AVAILABLE,
    phone: employee.phone_number || employee.employee_phone || NOT_AVAILABLE,
    email:
      effectiveUser?.email ??
      employee.email ??
      employee.employee_email ??
      NOT_AVAILABLE,
    roleName,
    departmentLabel: employee.department?.name ?? NOT_AVAILABLE,
    positionLabel:
      employee.workposition?.name ??
      employee.workposition_name ??
      NOT_AVAILABLE,
    assignedDevices,
  }

  return {
    ...rowData,
    searchContent: buildActivatedUserSearchContent(rowData),
  }
}
