import type {
  Authorization,
  AuthorizationType,
  PostAuthorization,
  PutAuthorizer,
} from '@/app/mappings/authorizations/authorizations.types'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'

export type AuthorizationsState = {
  authorizations: Authorization[]
  authorizationHistory: Authorization[]
  authorizationBillingDocuments: BillingDocuments[]
  authorizationTypes: AuthorizationType[]
  loading: boolean
  loadingTypes: boolean
  loadingHistory: boolean
  loadingBillingDocuments: boolean
  creating: boolean
  updatingStatus: boolean
  updatingAuthorizer: boolean
  successGet: boolean
  successGetTypes: boolean
  successGetHistory: boolean
  successGetBillingDocuments: boolean
  successCreate: boolean
  successUpdateStatus: boolean
  successUpdateAuthorizer: boolean
  lastHistoryRequisitionId?: string
  lastBillingDocumentsAuthorizationId?: string
  error?: string
  getAuthorizations: (force?: boolean) => Promise<void>
  getAuthorizationsByIdAuthorizer: (idAuthorizer: string, force?: boolean) => Promise<void>
  getAuthorizationTypes: (force?: boolean) => Promise<void>
  getRequisitionAuthorizationsHistory: (
    idRequisition: string,
    force?: boolean,
  ) => Promise<Authorization[]>
  getAuthorizationBillingDocuments: (
    idAuthorization: string,
    force?: boolean,
  ) => Promise<BillingDocuments[]>
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
