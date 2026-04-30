import {
  CreateUserPayload,
  MfaMethodPayloadMethod,
  RolePost,
  ToggleUserActivePayload,
  UpdateUserPayload,
  UserMfaByIdResponse,
  UserMfaMethodPayload,
  UserMfaMethodResponse,
  UserMfaPayload,
  UserPasskeyResponse,
  UserPost,
  UserPut,
  UserRole,
  UserSignaturePayload,
  UserType,
} from "./user.types";

const toString = (value: unknown, fallback = "") => {
  if (value == null) return fallback;
  const str = String(value).trim();
  return str === "" ? fallback : str;
};

const toOptionalString = (value: unknown) => {
  if (value == null) return undefined;
  const str = String(value).trim();
  return str === "" ? undefined : str;
};

const toNullableString = (value: unknown) => {
  if (value == null) return null;
  const str = String(value).trim();
  return str === "" ? null : str;
};

const toBoolean = (value: unknown, fallback = false) =>
  value == null ? fallback : Boolean(value);

const toNumber = (value: unknown, fallback = 0) => {
  if (value == null || value === "") return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => toOptionalString(item))
    .filter((item): item is string => item !== undefined);
};

const toMfaMethodResponse = (value: unknown): "SMS" | "Email" =>
  toString(value).toUpperCase() === "SMS" ? "SMS" : "Email";

const toMfaMethodPayload = (value: unknown): MfaMethodPayloadMethod =>
  toString(value).toUpperCase() === "SMS" ? "SMS" : "EMAIL";

export const mapUser = (user: any): UserType => {
  const rawRole = user?.role;
  const role = rawRole ? mapUserRole(rawRole) : null;
  const roles = Array.isArray(user?.roles)
    ? mapUserRoles(user.roles)
    : role
    ? [role]
    : [];

  const employeeId = toNullableString(user?.employee_id ?? user?.idemployee);
  const roleId = toNullableString(
    user?.role_id ?? user?.id_role ?? user?.idrole ?? role?.id
  );

  return {
    user_id: toString(user?.user_id ?? user?.id),
    username: toString(user?.username),
    email: toOptionalString(user?.email) ?? null,
    email_confirmed: toBoolean(user?.email_confirmed),
    phone_number: toOptionalString(user?.phone_number) ?? null,
    phone_number_confirmed: toBoolean(user?.phone_number_confirmed),
    two_factor_enabled: toBoolean(user?.two_factor_enabled),
    lockout_enabled: toBoolean(user?.lockout_enabled),
    access_failed_count: toNumber(user?.access_failed_count),
    lockout_end: toNullableString(user?.lockout_end),
    change_password: toBoolean(user?.change_password),
    signature: toNullableString(user?.signature),
    is_active: toBoolean(user?.is_active, true),
    employee_id: employeeId ?? undefined,
    idemployee: employeeId ?? undefined,
    role_id: roleId ?? undefined,
    role,
    roles,
    permissions: toStringArray(user?.permissions),
  };
};

export const mapUsers = (users: any[] | undefined): UserType[] =>
  Array.isArray(users) ? users.map(mapUser) : [];

export const mapUserPost = (
  payload: Partial<CreateUserPayload | UserPost> | any
): UserPost => ({
  username: toString(payload?.username),
  password: toString(payload?.password),
  idrole: toString(
    payload?.roleId ??
      payload?.role_id ??
      payload?.id_role ??
      payload?.idrole ??
      payload?.role?.id
  ),
  idemployee: toString(
    payload?.employeeId ??
      payload?.employee_id ??
      payload?.idemployee ??
      payload?.id_employee ??
      payload?.user?.employee_id ??
      payload?.user?.id
  ),
  two_factor_enabled: toBoolean(
    payload?.twoFactorEnabled ?? payload?.two_factor_enabled,
    true
  ),
  change_password: toBoolean(
    payload?.changePassword ?? payload?.change_password,
    true
  ),
});

export const mapUserPut = (
  payload: Partial<UpdateUserPayload | UserPut> | any
): UserPut => {
  const result: UserPut = {
    user_id: toString(
      payload?.userId ??
        payload?.user_id ??
        payload?.id_user ??
        payload?.idemployee ??
        payload?.employeeId ??
        payload?.id
    ),
    username: toString(payload?.username),
    id_role: toString(
      payload?.roleId ??
        payload?.role_id ??
        payload?.id_role ??
        payload?.role?.id ??
        payload?.idrole
    ),
  };

  const hasSignature =
    payload != null &&
    Object.prototype.hasOwnProperty.call(payload, "signature");
  if (hasSignature) {
    const normalizedSignature = toNullableString(payload?.signature);
    if (normalizedSignature !== null) {
      result.signature = normalizedSignature;
    } else {
      result.signature = null;
    }
  }

  const changePassword =
    payload?.changePassword ?? payload?.change_password;
  if (changePassword !== undefined) {
    result.change_password = toBoolean(changePassword);
  }

  const twoFactor =
    payload?.twoFactorEnabled ?? payload?.two_factor_enabled;
  if (twoFactor !== undefined) {
    result.two_factor_enabled = toBoolean(twoFactor);
  }

  return result;
};

export const mapUserRole = (role: any): UserRole => ({
  id: toString(
    role?.id ??
      role?.role_id ??
      role?.id_role ??
      role?.idrol ??
      role?.idRole ??
      role?.roleId
  ),
  name: toString(role?.name),
  description: toNullableString(role?.description),
  isActive: toBoolean(role?.isActive ?? role?.is_active ?? role?.active, true),
});

export const mapUserRoles = (roles: any): UserRole[] =>
  Array.isArray(roles) ? roles.map(mapUserRole) : [];

export const mapRolePost = (payload: Partial<RolePost> | any): RolePost => {
  const result: RolePost = {
    name: toString(payload?.name),
  };

  const description = toOptionalString(payload?.description);
  if (description !== undefined) {
    result.description = description;
  }

  return result;
};

export const mapUserSignaturePayload = (
  payload: Partial<UserSignaturePayload> | any
): UserSignaturePayload => ({
  idemployee: toString(
    payload?.idemployee ??
      payload?.employeeId ??
      payload?.employee_id ??
      payload?.user_id ??
      payload?.id
  ),
  signature: toString(payload?.signature),
});

export const mapToggleUserActivePayload = (
  payload: Partial<ToggleUserActivePayload> | any
): ToggleUserActivePayload => ({
  id: toString(
    payload?.id ??
      payload?.userId ??
      payload?.user_id ??
      payload?.idemployee ??
      payload?.employeeId
  ),
  isActive: toBoolean(
    payload?.isActive ?? payload?.is_active ?? payload?.active,
    false
  ),
});

export const mapUserMfaByIdMethodResponse = (
  method: any,
): UserMfaMethodResponse => ({
  method: toMfaMethodResponse(method?.method),
  isEnabled: toBoolean(method?.isEnabled),
  isVerified: toBoolean(method?.isVerified),
  destinationMasked: toNullableString(method?.destinationMasked),
  challengeId: toNullableString(method?.challengeId),
});

export const mapUserMfaByIdResponse = (raw: any): UserMfaByIdResponse => {
  const source = raw?.data ?? raw;
  const methods = Array.isArray(source?.methods) ? source.methods : [];

  return {
    idUser: toString(source?.idUser),
    twoFactorEnabled: toBoolean(source?.twoFactorEnabled),
    methods: methods.map(mapUserMfaByIdMethodResponse),
  };
};

export const mapUserMfaPayload = (
  payload: Partial<UserMfaPayload> | any,
): UserMfaPayload => ({
  idUser: toString(payload?.idUser ?? payload?.id_user ?? payload?.userId),
  twoFactorEnabled: toBoolean(payload?.twoFactorEnabled),
});

export const mapUserMfaMethodPayload = (
  payload: Partial<UserMfaMethodPayload> | any,
): UserMfaMethodPayload => ({
  idUser: toString(payload?.idUser ?? payload?.id_user ?? payload?.userId),
  method: toMfaMethodPayload(payload?.method),
  isEnabled: toBoolean(payload?.isEnabled),
});

export const mapUserPasskeyResponse = (raw: any): UserPasskeyResponse => ({
  id: toString(raw?.id ?? raw?.passkeyId ?? raw?.credentialId),
  idUser: toString(raw?.idUser ?? raw?.userId ?? raw?.id_user),
  friendlyName: toNullableString(raw?.friendlyName ?? raw?.name ?? raw?.deviceName),
  createdAt: toNullableString(raw?.createdAt ?? raw?.created_at),
  lastUsedAt: toNullableString(raw?.lastUsedAt ?? raw?.last_used_at),
});

export const mapUserPasskeysResponse = (raw: any): UserPasskeyResponse[] => {
  const source = raw?.data ?? raw;
  const list = Array.isArray(source) ? source : [];
  return list.map(mapUserPasskeyResponse);
};
