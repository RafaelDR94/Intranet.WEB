// src/app/mappings/auth/auth.mapper.ts
import {
  PostLogin,
  PostAuthValidate,
  PostCreateNip,
  PutChangePassword,
  PutRecoverPassword,
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

export const PutRecoverPasswordMap = (src: any): PutRecoverPassword => ({
  username: toString(src?.username),
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

export const GetFirebaseConfigurationMap = (raw: any): GetFirebaseConfiguration => ({
  data: FirebaseDataMap(raw?.data ?? {}),
  success: toBoolean(raw?.success),
  error_Message: toString(raw?.error_Message),
  error_Code: toNumber(raw?.error_Code),
});
