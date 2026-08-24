import type {
  RecoverChannel,
  PasswordRecoveryVerificationResponse,
  RecoverPasswordResponse,
  ResetPasswordRecoveryResponse,
  AuthChallengeVerifyResponse,
} from '@/app/mappings/auth/auth.types'
import type { UserMfaByIdResponse, UserPasskeyResponse } from '@/app/mappings/users/user.types'
import type { User, LoginCredentials, FirebaseSessionStatus } from '@/app/context/AuthContext/types'

export interface AuthValidatePayload {
  "idemployee": string, "password": string
}

export interface ChangePasswordPayload {
  email: string,
  newPassword: string
  changePassword: boolean,

}
export interface SignaturePayload {
  "idemployee": string,
  "signature": string
};

export interface MfaPayload {
  idUser: string
  twoFactorEnabled: boolean
}

export interface MfaMethodPayload {
  idUser: string
  method: "SMS" | "Email" | "Passkey"
  isEnabled: boolean
  destination?: string
  idPasskey?: string
}


export interface RecoverPasswordPayload {
  email: string
  type: "Email" | "SMS"
  purpose?: "PasswordRecovery" | "LoginMfa"
  phoneNumber?: string
  challengeId?: string
  idUser?: string
}

export interface VerifyPasswordRecoveryCodePayload {
  challengeId: string
  code: string
}

export interface VerifyPasswordRecoverySmsPayload {
  challengeId: string
  token: string
}

export interface VerifyAuthChallengePayload {
  challengeId: string
  method: "Email" | "SMS" | "PASSKEY"
  code: string | null
  verificationToken: string | null
}

export interface ResetPasswordRecoveryPayload {
  challengeId: string
  newPassword: string
  confirmPassword: string
}

export interface NipPayload {
  user_id: string
  nip: string
}

export interface LoginResponse {
  token: string
}

export interface FirebaseConfiguration {
  apiKey: string
}

export interface AuthState {
  signature?: string,
  loginData?: LoginResponse
  firebaseConfig?: FirebaseConfiguration
  /** Usuario autenticado actualmente */
  user: User | null
  /** Último usuario recordado */
  userRemebered: User | null
  /** Token de autenticación */
  token: string | null
  /** Indica si la sesión expiró */
  hasExpired: boolean
  /** Marca cuando el estado inicial ya termino de hidratarse desde almacenamiento */
  hydrated: boolean
  /** Indica si se debe recordar al usuario */
  remeberMe: boolean
  /** Modo offline habilitado */
  offlineMode: boolean
  /** Estado de la sesión Firebase asociada a la sesión del backend. */
  firebaseSessionStatus: FirebaseSessionStatus
  loading: boolean
  changingSignature: boolean
  changingMFA: boolean
  changingMFAMethod: boolean
  recoveringPassword: boolean
  verifyingPasswordRecovery: boolean
  resettingPasswordRecovery: boolean
  verifyingAuthChallenge: boolean
  fetchingRecoverChannels: boolean
  fetchingUserMfaById: boolean
  fetchingUserPasskeys: boolean
  deletingUserPasskey: boolean
  registeringUserPasskey: boolean
  recoverChannels: RecoverChannel[]
  userMfaById: UserMfaByIdResponse | null
  userPasskeys: UserPasskeyResponse[]
  mfaSmsEnabled: boolean
  mfaEmailEnabled: boolean
  recoverPasswordRequest?: RecoverPasswordPayload
  recoverPasswordChallenge?: RecoverPasswordResponse
  passwordRecoveryVerification?: PasswordRecoveryVerificationResponse
  passwordRecoveryResetResponse?: ResetPasswordRecoveryResponse
  authChallengeVerification?: AuthChallengeVerifyResponse
  successLogin: boolean
  successAuthValidate: boolean
  successChangePassword: boolean
  successRecoverPassword: boolean
  successPasswordRecoveryVerification: boolean
  successResetPasswordRecovery: boolean
  successAuthChallengeVerification: boolean
  successRecoverChannels: boolean
  successChangeNIPStatus: boolean
  succesChangeSignature: boolean
  successChangeNIP: boolean
  successCreateNIP: boolean
  successFirebaseConfig: boolean
  successChangeMFA: boolean
  successChangeMFAMethod: boolean
  successUserMfaById: boolean
  successUserPasskeys: boolean
  successDeleteUserPasskey: boolean
  successRegisterUserPasskey: boolean
  error?: string
  login: (payload: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  verifyOTP: (optcode: string) => Promise<void>
  askforOTPemail: () => Promise<void>
  validLoggin: () => Promise<boolean>
  UpdateUser: (user: User) => Promise<void>
  setHasExpired: (value: boolean) => void
  handleRemeberMe: (rememberme: boolean) => void
  handleForgetUser: () => Promise<void>
  handleOfflineMode: (offline: boolean) => void
  setFirebaseSessionStatus: (status: FirebaseSessionStatus) => void
  authValidate: (payload: AuthValidatePayload) => Promise<void>
  changePassword: (payload: ChangePasswordPayload) => Promise<void>
  recoverPassword: (payload: RecoverPasswordPayload) => Promise<RecoverPasswordResponse | null>
  fetchRecoverChannels: (email: string) => Promise<RecoverChannel[] | null>
  verifyPasswordRecoveryCode: (
    payload: VerifyPasswordRecoveryCodePayload,
  ) => Promise<PasswordRecoveryVerificationResponse | null>
  verifyPasswordRecoverySms: (
    payload: VerifyPasswordRecoverySmsPayload,
  ) => Promise<PasswordRecoveryVerificationResponse | null>
  verifyAuthChallenge: (
    payload: VerifyAuthChallengePayload,
  ) => Promise<AuthChallengeVerifyResponse | null>
  resetPasswordRecovery: (
    payload: ResetPasswordRecoveryPayload,
  ) => Promise<ResetPasswordRecoveryResponse | null>
  fetchFirebaseConfiguration: () => Promise<void>
  updateUserPermissions: (permissions: string) => Promise<void>
  changeNipStatusByIdUser: (id: number) => Promise<void>
  changeMfaStatus: (payload: MfaPayload) => Promise<void>
  changeMfaMethodStatus: (payload: MfaMethodPayload) => Promise<void>
  fetchUserMfaById: (idUser: string) => Promise<UserMfaByIdResponse | null>
  fetchUserPasskeys: (idUser: string) => Promise<UserPasskeyResponse[] | null>
  deleteUserPasskey: (id: string) => Promise<boolean>
  registerUserPasskeyOptions: (deviceName: string) => Promise<boolean>
  changeNip: (payload: NipPayload) => Promise<void>
  createNip: (payload: NipPayload) => Promise<void>
  changeSignature: (payload: SignaturePayload) => Promise<void>
  clearRecoverPasswordState: () => void
  reset: () => void
  resetFlags: () => void
  resetSignature: () => void
}

export type Set = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void
export type Get = () => AuthState
