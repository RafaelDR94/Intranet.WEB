import type {
  Authorization,
  AuthorizationType,
  PostAuthorization,
  PutAuthorizer,
} from '@/app/mappings/authorizations/authorizations.types'

export type AuthorizationsState = {
  authorizations: Authorization[]
  authorizationTypes: AuthorizationType[]
  loading: boolean
  loadingTypes: boolean
  creating: boolean
  updatingStatus: boolean
  updatingAuthorizer: boolean
  successGet: boolean
  successGetTypes: boolean
  successCreate: boolean
  successUpdateStatus: boolean
  successUpdateAuthorizer: boolean
  error?: string
  getAuthorizations: (force?: boolean) => Promise<void>
  getAuthorizationsByIdAuthorizer: (idAuthorizer: string, force?: boolean) => Promise<void>
  getAuthorizationTypes: (force?: boolean) => Promise<void>
  createAuthorization: (payload: PostAuthorization) => Promise<Authorization | null>
  updateAuthorizationAuthorizer: (
    authorizationId: string,
    payload: PutAuthorizer,
  ) => Promise<boolean>
  approveAuthorization: (authorizationId: string) => Promise<boolean>
  rejectAuthorization: (authorizationId: string, comment: string) => Promise<boolean>
  resolveAuthorizationTypeId: (name: string) => string | undefined
  resolveAuthorizationTypeName: (id: string) => string | undefined
  reset: () => void
  resetFlags: () => void
}

export type SetAuthorizationsState = (
  partial: Partial<AuthorizationsState> | ((state: AuthorizationsState) => Partial<AuthorizationsState>),
) => void

export type GetAuthorizationsState = () => AuthorizationsState
