export type UserRole = {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
};

export type UserEmployeeSummary = {
  employee_id: string;
  image_url: string;
  fullname: string;
  department: string;
  workposition: string;
  employee_number: string;
  dr_fingerprint: boolean;
};

export type UserType = {
  user_id: string;
  username: string;
  email?: string | null;
  email_confirmed: boolean;
  phone_number?: string | null;
  image_url?: string | null;
  phone_number_confirmed: boolean;
  two_factor_enabled: boolean;
  lockout_enabled: boolean;
  access_failed_count: number;
  lockout_end: string | null;
  change_password: boolean;
  signature: string | null;
  is_active: boolean;
  is_gerence?: boolean;
  employee_id?: string | null;
  idemployee?: string | null;
  role_id?: string | null;
  role?: UserRole | null;
  roles: UserRole[];
  permissions: string[];
};

export type CreateUserPayload = {
  username: string;
  imageUrl?: string;
  phoneNumber?: string;
  isGerence?: boolean;
  drFingerprint?: boolean;
  password: string;
  signature?: string;
  employeeId: string;
  roleId: string;
  changePassword?: boolean;
};

export type UserPost = {
  username: string;
  image_url: string;
  phone_number: string;
  is_gerence: boolean;
  dr_fingerprint: boolean;
  password: string;
  signature: string;
  idrole: string;
  idemployee: string;
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

export type UpdateUserProfilePayload = {
  userId: string;
  employeeId: string;
  roleId: string;
  email: string;
  phoneNumber: string;
  imageUrl: string;
  isGerence: boolean;
  drFingerprint: boolean;
  password: string;
  changePassword: boolean;
};

export type UserProfilePut = {
  user_id: string;
  employee_id: string;
  role_id: string;
  email: string;
  phone_number: string;
  image_url: string;
  is_gerence: boolean;
  dr_fingerprint: boolean;
  password: string;
  change_password: boolean;
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

export type MfaMethod = "SMS" | "Email" | "Passkey";

export type MfaMethodPayloadMethod = "SMS" | "Email" | "Passkey";

export type UserMfaMethodResponse = {
  method: MfaMethod;
  isEnabled: boolean;
  isVerified: boolean;
  destinationMasked: string | null;
  destination?: string | null;
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
  destination?: string;
  idPasskey?: string;
};

export type UserPasskeyResponse = {
  id: string;
  idUser: string;
  friendlyName: string | null;
  createdAt: string | null;
  lastUsedAt: string | null;
};



export type UserRol = UserRole;
