export interface LoginPayload {
  username: string
  password: string
}

export interface AuthValidatePayload {
  token: string
}

export interface ChangePasswordPayload {
  idUser: number
  password: string
  newPassword: string
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
  loading: boolean
  successLogin: boolean
  successAuthValidate: boolean
  successChangePassword: boolean
  successRecoverPassword: boolean
  successChangeNIPStatus: boolean
  successChangeNIP: boolean
  successCreateNIP: boolean
  successFirebaseConfig: boolean
  error?: string
  login: (payload: LoginPayload) => Promise<void>
  authValidate: (payload: AuthValidatePayload) => Promise<void>
  changePassword: (payload: ChangePasswordPayload) => Promise<void>
  recoverPassword: (payload: RecoverPasswordPayload) => Promise<void>
  fetchFirebaseConfiguration: () => Promise<void>
  changeNipStatusByIdUser: (id: number) => Promise<void>
  changeNip: (payload: NipPayload) => Promise<void>
  createNip: (payload: NipPayload) => Promise<void>
  reset: () => void
  resetFlags: () => void
}

export type Set = (partial: Partial<AuthState> | ((state: AuthState) => Partial<AuthState>)) => void
export type Get = () => AuthState
