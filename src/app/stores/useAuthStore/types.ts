import type {
  RecoverChannel,
  PasswordRecoveryVerificationResponse,
  RecoverPasswordResponse,
  ResetPasswordRecoveryResponse,
} from '@/app/mappings/auth/auth.types'
import type { User, LoginCredentials } from '@/app/context/AuthContext/types'

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


export interface RecoverPasswordPayload {
  email: string
  type: "Email" | "SMS"
}

export interface VerifyPasswordRecoveryCodePayload {
  challengeId: string
  code: string
}

export interface VerifyPasswordRecoverySmsPayload {
  challengeId: string
  token: string
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
  loading: boolean
  changingSignature: boolean
  recoveringPassword: boolean
  verifyingPasswordRecovery: boolean
  resettingPasswordRecovery: boolean
  fetchingRecoverChannels: boolean
  recoverChannels: RecoverChannel[]
  recoverPasswordRequest?: RecoverPasswordPayload
  recoverPasswordChallenge?: RecoverPasswordResponse
  passwordRecoveryVerification?: PasswordRecoveryVerificationResponse
  passwordRecoveryResetResponse?: ResetPasswordRecoveryResponse
  successLogin: boolean
  successAuthValidate: boolean
  successChangePassword: boolean
  successRecoverPassword: boolean
  successPasswordRecoveryVerification: boolean
  successResetPasswordRecovery: boolean
  successRecoverChannels: boolean
  successChangeNIPStatus: boolean
  succesChangeSignature: boolean
  successChangeNIP: boolean
  successCreateNIP: boolean
  successFirebaseConfig: boolean
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
  resetPasswordRecovery: (
    payload: ResetPasswordRecoveryPayload,
  ) => Promise<ResetPasswordRecoveryResponse | null>
  fetchFirebaseConfiguration: () => Promise<void>
  updateUserPermissions: (permissions: string) => Promise<void>
  changeNipStatusByIdUser: (id: number) => Promise<void>
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
