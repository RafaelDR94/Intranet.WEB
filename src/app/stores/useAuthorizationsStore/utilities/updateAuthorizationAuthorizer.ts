import type { AxiosResponse } from 'axios'

import type { PutAuthorizer } from '@/app/mappings/authorizations/authorizations.types'

import type { GetAuthorizationsState, SetAuthorizationsState } from '../types'

import { AuthorizationChangeAuthorizer } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Actualiza el autorizador de una autorización en backend.
 * @param set Zustand setter
 * @param get Zustand getter
 * @param authorizationId ID de la autorización
 * @param payload Nuevo autorizador
 */
export const updateAuthorizationAuthorizer = async (
  set: SetAuthorizationsState,
  get: GetAuthorizationsState,
  authorizationId: string,
  payload: PutAuthorizer,
): Promise<boolean> => {
  set({ updatingAuthorizer: true, error: undefined, successUpdateAuthorizer: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const url = `${AuthorizationChangeAuthorizer}?idAuthorization=${encodeURIComponent(
      authorizationId,
    )}&idAuthorizer=${encodeURIComponent(payload.authorizer_id)}`
    const res: AxiosResponse = await put(url, {})
    const success = Boolean(res)

    const next = get().authorizations.map((item) =>
      item.authorization_id === authorizationId
        ? {
            ...item,
            authorizer: {
              ...item.authorizer,
              employee_id: payload.authorizer_id,
              id: payload.authorizer_id,
            },
          }
        : item,
    )

    set({ authorizations: next, updatingAuthorizer: false, successUpdateAuthorizer: success })
    return success
  } catch (error) {
    const err = normalizeApiError(error)
    set({
      updatingAuthorizer: false,
      successUpdateAuthorizer: false,
      error: err.message,
    })
    return false
  }
}
