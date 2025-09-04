import type { User, LoginCredentials } from '@/app/context/AuthContext/types'

export interface AuthValidatePayload {
  token: string
}

export interface ChangePasswordPayload {
  email: string,
  newPassword: string
  changePassword: boolean,

}

export interface RecoverPasswordPayload {
  username: string
}

export interface NipPayload {
  idUser: number
  nip: string
}

export interface LoginResponse {
  token: string
}

export interface FirebaseConfiguration {
  apiKey: string
}

export interface AuthState {
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
  /** Indica si se debe recordar al usuario */
  remeberMe: boolean
  /** Modo offline habilitado */
  offlineMode: boolean
  loading: boolean
  recoveringPassword: boolean
  successLogin: boolean
  successAuthValidate: boolean
  successChangePassword: boolean
  successRecoverPassword: boolean
  successChangeNIPStatus: boolean
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
  recoverPassword: (payload: RecoverPasswordPayload) => Promise<void>
  fetchFirebaseConfiguration: () => Promise<void>
  updateUserPermissions:(permissions: string) => Promise<void>
  changeNipStatusByIdUser: (id: number) => Promise<void>
  changeNip: (payload: NipPayload) => Promise<void>
  createNip: (payload: NipPayload) => Promise<void>
  reset: () => void
  resetFlags: () => void
}

export type Set = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void
export type Get = () => AuthState
