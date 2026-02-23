import type { AxiosResponse } from 'axios'

import type { GetAuthorizationsState, SetAuthorizationsState } from '../types'

import { AuthorizationApprove } from '@/app/configurations/Axios/urls'
import type { AuthorizationStatus } from '@/app/mappings/authorizations/authorizations.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

const buildAuthorizationStatus = (
  current: AuthorizationStatus | undefined,
  name: string,
): AuthorizationStatus => ({
  id: current?.id ?? '',
  name,
  type: current?.type ?? 'Authorization',
  is_active: current?.is_active ?? true,
})

/**
 * Aprueba una autorización.
 * @param set Zustand setter
 * @param get Zustand getter
 * @param authorizationId ID de la autorización
 */
export const approveAuthorization = async (
  set: SetAuthorizationsState,
  get: GetAuthorizationsState,
  authorizationId: string,
): Promise<boolean> => {
  set({ updatingStatus: true, error: undefined, successUpdateStatus: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const url = `${AuthorizationApprove}?idAuthorization=${encodeURIComponent(authorizationId)}`
    const res: AxiosResponse = await put(url, {})
    const success = Boolean(res)

    const next = get().authorizations.map((item) =>
      item.authorization_id === authorizationId
        ? {
            ...item,
            status: buildAuthorizationStatus(item.status, 'Aprobada'),
            comment: undefined,
          }
        : item,
    )

    set({ authorizations: next, updatingStatus: false, successUpdateStatus: success })
    return success
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      updatingStatus: false,
      successUpdateStatus: false,
      error: err.message,
    })
    return false
  }
}
