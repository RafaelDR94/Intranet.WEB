export type PendingUserRow = {
  id: string
  fullname: string
  avatarUrl?: string
  department: string
  position: string
  employeeNumber: string
  hasFingerprint: boolean
  fingerprintLabel?: string
  searchContent?: string
  actions?: string
}

export type PendingUserDetailData = PendingUserRow & {
  avatarUrl?: string
  company: string
  firstName: string
  middleName: string
  lastName: string
  secondLastName: string
  managerName: string
  departmentLabel: string
  companyLabel: string
  positionLabel: string
  email: string
  businessPhone: string
  userRoleId: string
  roleName: string
  changePasswordOnNextLogin: boolean
  managerialPermissions: boolean
  deviceType: string
  deviceBrand: string
  deviceModel: string
  deviceStatus: string
  provisionalPassword: string
  nip: string
  signature?: string
}

export type PendingUserActivationPayload = {
  userId: string
  profileImage: unknown
  email: string
  businessPhone: string
  userRoleId: string
  managerialPermissions: boolean
  provisionalPassword: string
  changePasswordOnNextLogin: boolean
  hasFingerprint: boolean
  signature: string
}

export type ActivationTabId = 'employee' | 'signature'
