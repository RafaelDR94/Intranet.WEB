export type UserRole = {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export type UserType = {
  user_id: string;
  username: string;
  email?: string | null;
  email_confirmed: boolean;
  phone_number?: string | null;
  phone_number_confirmed: boolean;
  two_factor_enabled: boolean;
  lockout_enabled: boolean;
  access_failed_count: number;
  lockout_end: string | null;
  change_password: boolean;
  signature: string | null;
  is_active: boolean;
  employee_id?: string | null;
  idemployee?: string | null;
  role_id?: string | null;
  role?: UserRole | null;
  roles: UserRole[];
  permissions: string[];
};

export type CreateUserPayload = {
  username: string;
  password: string;
  employeeId: string;
  roleId: string;
  twoFactorEnabled?: boolean;
  changePassword?: boolean;
};

export type UserPost = {
  username: string;
  password: string;
  idrole: string;
  idemployee: string;
  two_factor_enabled: boolean;
  change_password: boolean;
};

export type UpdateUserPayload = {
  userId: string;
  username: string;
  roleId: string;
  signature?: string | null;
  twoFactorEnabled?: boolean;
  changePassword?: boolean;
};

export type UserPut = {
  user_id: string;
  username: string;
  id_role: string;
  signature?: string | null;
  two_factor_enabled?: boolean;
  change_password?: boolean;
};

export type UserSignaturePayload = {
  idemployee: string;
  signature: string;
};

export type ToggleUserActivePayload = {
  id: string;
  isActive: boolean;
};

export type RolePost = {
  name: string;
  description?: string | null;
};

export type MfaMethod = "SMS" | "Email";

export type MfaMethodPayloadMethod = "SMS" | "EMAIL";

export type UserMfaMethodResponse = {
  method: MfaMethod;
  isEnabled: boolean;
  isVerified: boolean;
  destinationMasked: string | null;
  challengeId: string | null;
};

export type UserMfaByIdResponse = {
  idUser: string;
  twoFactorEnabled: boolean;
  methods: UserMfaMethodResponse[];
};

export type UserMfaPayload = {
  idUser: string;
  twoFactorEnabled: boolean;
};

export type UserMfaMethodPayload = {
  idUser: string;
  method: MfaMethodPayloadMethod;
  isEnabled: boolean;
};

export type UserPasskeyResponse = {
  id: string;
  idUser: string;
  friendlyName: string | null;
  createdAt: string | null;
  lastUsedAt: string | null;
};



export type UserRol = UserRole;
