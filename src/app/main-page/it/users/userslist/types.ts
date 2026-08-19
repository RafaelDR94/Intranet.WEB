export type ActivatedUserRow = {
  id: string
  fullname: string
  avatarUrl?: string
  department: string
  position: string
  employeeNumber: string
  isActive: boolean
  hasFingerprint: boolean
  statusLabel?: string
  fingerprintLabel?: string
  searchContent?: string
  actions?: string
}

export type AssignedUserDevice = {
  id: string
  typeLabel: string
  description: string
}

export type UserAccountDetailData = ActivatedUserRow & {
  userId: string
  company: string
  statusLabel: string
  avatarUrl?: string
  username: string
  userRoleId: string
  twoFactorEnabled: boolean
  changePasswordOnNextLogin: boolean
  managerialPermissions: boolean
  businessPhone: string
  provisionalPassword: string
  phone: string
  email: string
  roleName: string
  departmentLabel: string
  positionLabel: string
  assignedDevices: AssignedUserDevice[]
}
