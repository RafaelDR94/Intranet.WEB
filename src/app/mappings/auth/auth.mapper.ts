// src/app/mappings/auth/auth.mapper.ts
import {
  PostLogin,
  PostAuthValidate,
  PostCreateNip,
  RecoverChannel,
  PutChangePassword,
  PostRecoverPassword,
  RecoverPasswordResponse,
  PostVerifyPasswordRecoveryCode,
  PostVerifyPasswordRecoverySms,
  PasswordRecoveryVerificationResponse,
  PostResetPasswordRecovery,
  ResetPasswordRecoveryResponse,
  PutChangeNipStatus,
  PutChangeNip,
  GetFirebaseConfiguration,
  FirebaseConfig,
  FirebaseData
} from './auth.types';

/**
 * Helpers
 */
const toString = (v: unknown, fallback = "") => (v == null ? fallback : String(v));
const toBoolean = (v: unknown, fallback = false) => (v == null ? fallback : Boolean(v));
const toNumber = (v: unknown, fallback = 0) => {
  const num = Number(v);
  return isNaN(num) ? fallback : num;
};

/**
 * Payload Maps (POST/PUT)
 */
export const PostLoginMap = (src: any): PostLogin => ({
  email: toString(src?.email),
  password: toString(src?.password),
});

export const PostAuthValidateMap = (src: any): PostAuthValidate => ({
  idemployee: toString(src?.idemployee),
  password: toString(src?.password),
});

export const PostCreateNipMap = (src: any): PostCreateNip => ({
  user_id: toString(src?.user_id),
  nip: toString(src?.nip),
});

export const PutChangePasswordMap = (src: any): PutChangePassword => ({
  email: toString(src?.email),
  newPassword: toString(src?.newPassword),
  changePassword: toBoolean(src?.changePassword),
});

export const PostRecoverPasswordMap = (src: any): PostRecoverPassword => ({
  email: toString(src?.email),
  type: toString(src?.type).toUpperCase() === "SMS" ? "SMS" : "Email",
});

export const PostVerifyPasswordRecoveryCodeMap = (
  src: any,
): PostVerifyPasswordRecoveryCode => ({
  challengeId: toString(src?.challengeId),
  code: toString(src?.code),
});

export const PostVerifyPasswordRecoverySmsMap = (
  src: any,
): PostVerifyPasswordRecoverySms => ({
  challengeId: toString(src?.challengeId),
  token: toString(src?.token),
});

export const PostResetPasswordRecoveryMap = (
  src: any,
): PostResetPasswordRecovery => ({
  challengeId: toString(src?.challengeId),
  newPassword: toString(src?.newPassword),
  confirmPassword: toString(src?.confirmPassword),
});

export const PutChangeNipStatusMap = (src: any): PutChangeNipStatus => ({
  id: toString(src?.id),
});

export const PutChangeNipMap = (src: any): PutChangeNip => ({
  user_id: toString(src?.user_id),
  nip: toString(src?.nip),
});

/**
 * Response Maps (GET)
 */
export const FirebaseConfigMap = (raw: any): FirebaseConfig => ({
  apiKey: toString(raw?.apiKey),
  authDomain: toString(raw?.authDomain),
  databaseURL: toString(raw?.databaseURL),
  projectId: toString(raw?.projectId),
  storageBucket: toString(raw?.storageBucket),
  messagingSenderId: toString(raw?.messagingSenderId),
  appId: toString(raw?.appId),
  measurementId: toString(raw?.measurementId),
});

export const FirebaseDataMap = (raw: any): FirebaseData => ({
  firebaseConfig: FirebaseConfigMap(raw?.firebaseConfig ?? {}),
  userFirebase: toString(raw?.userFirebase),
  paswordFirebase: toString(raw?.paswordFirebase),
});

export const RecoverPasswordResponseMap = (
  raw: any,
): RecoverPasswordResponse => {
  const source = raw?.data ?? raw;

  return {
    type: toString(source?.type).toUpperCase() === "SMS" ? "SMS" : "Email",
    challengeId: toString(source?.challengeId),
    phoneMasked:
      source?.phoneMasked == null ? undefined : toString(source?.phoneMasked),
    emailMasked:
      source?.emailMasked == null ? undefined : toString(source?.emailMasked),
    message: toString(source?.message),
    expiresInSeconds: toNumber(source?.expiresInSeconds),
    nextStep: toString(source?.nextStep),
  };
};

export const RecoverChannelsMap = (raw: any): RecoverChannel[] => {
  const items = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : []

  return items.map((item: any) => ({
    type: toString(item?.type).toUpperCase() === "SMS" ? "SMS" : "Email",
    value: item?.value == null ? null : toString(item?.value),
  }))
}

export const PasswordRecoveryVerificationResponseMap = (
  raw: any,
): PasswordRecoveryVerificationResponse => {
  const source = raw?.data ?? raw;

  return {
    message: toString(source?.message),
    challengeId: toString(source?.challengeId),
    nextStep: toString(source?.nextStep),
  };
};

export const ResetPasswordRecoveryResponseMap = (
  raw: any,
): ResetPasswordRecoveryResponse => {
  const source = raw?.data ?? raw;

  return {
    success: toBoolean(source?.success),
    message: toString(source?.message),
    nextStep: toString(source?.nextStep),
  };
};

export const GetFirebaseConfigurationMap = (raw: any): GetFirebaseConfiguration => ({
  data: FirebaseDataMap(raw?.data ?? {}),
  success: toBoolean(raw?.success),
  error_Message: toString(raw?.error_Message),
  error_Code: toNumber(raw?.error_Code),
});
