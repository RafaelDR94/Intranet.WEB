import type { EmployeeType } from '@/app/mappings/employees/employee.types'
import type { UserEmployeeSummary, UserRole } from '@/app/mappings/users/user.types'

import type { PendingUserDetailData, PendingUserRow } from '../types'

const NOT_AVAILABLE = 'No disponible'

export const mapEmployeeSummaryToPendingUserRow = (
  employee: UserEmployeeSummary,
): PendingUserRow => ({
  id: employee.employee_id,
  fullname: employee.fullname,
  avatarUrl: employee.image_url || undefined,
  department: employee.department,
  position: employee.workposition,
  employeeNumber: employee.employee_number,
  hasFingerprint: employee.dr_fingerprint,
})

export const mapEmployeeSummaryToPendingUserDetailData = (
  employee: UserEmployeeSummary,
): PendingUserDetailData => {
  const row = mapEmployeeSummaryToPendingUserRow(employee)

  return {
    ...row,
    company: NOT_AVAILABLE,
    firstName: employee.fullname,
    middleName: '',
    lastName: '',
    secondLastName: '',
    managerName: NOT_AVAILABLE,
    departmentLabel: employee.department,
    companyLabel: NOT_AVAILABLE,
    positionLabel: employee.workposition,
    email: '',
    businessPhone: '',
    userRoleId: '',
    roleName: '',
    changePasswordOnNextLogin: true,
    managerialPermissions: false,
    deviceType: NOT_AVAILABLE,
    deviceBrand: NOT_AVAILABLE,
    deviceModel: NOT_AVAILABLE,
    deviceStatus: NOT_AVAILABLE,
    provisionalPassword: '',
    nip: '',
    signature: undefined,
  }
}

export const mapRolesToPendingRoleOptions = (roles: UserRole[]) =>
  roles.map((role) => ({
    label: role.name,
    value: role.id,
  }))

export const mapEmployeeToPendingUserDetailData = (
  employee: EmployeeType,
  summary?: UserEmployeeSummary | null,
): PendingUserDetailData => ({
  id: employee.employee_id,
  fullname: employee.fullname,
  avatarUrl: employee.image_url || undefined,
  department: employee.department?.name ?? NOT_AVAILABLE,
  position:
    employee.workposition?.name ??
    employee.workposition_name ??
    NOT_AVAILABLE,
  employeeNumber: employee.employee_number,
  hasFingerprint: summary?.dr_fingerprint ?? false,
  company: employee.department?.enterprice_name ?? NOT_AVAILABLE,
  firstName: employee.firstname ?? '',
  middleName: employee.secondname ?? '',
  lastName: employee.lastname ?? '',
  secondLastName: employee.motherlast_name ?? '',
  managerName: employee.manager_id || NOT_AVAILABLE,
  departmentLabel: employee.department?.name ?? NOT_AVAILABLE,
  companyLabel: employee.department?.enterprice_name ?? NOT_AVAILABLE,
  positionLabel:
    employee.workposition?.name ??
    employee.workposition_name ??
    NOT_AVAILABLE,
  email: employee.email ?? employee.employee_email ?? '',
  businessPhone:
    employee.extension || employee.phone_number || employee.employee_phone || '',
  userRoleId: '',
  roleName: '',
  changePasswordOnNextLogin: true,
  managerialPermissions: false,
  deviceType: NOT_AVAILABLE,
  deviceBrand: NOT_AVAILABLE,
  deviceModel: NOT_AVAILABLE,
  deviceStatus: NOT_AVAILABLE,
  provisionalPassword: '',
  nip: '',
  signature: undefined,
})
