import type { AxiosResponse } from 'axios'

import type { GetAuthorizationsState, SetAuthorizationsState } from '../types'

import { AuthorizationByIdAuthorizer } from '@/app/configurations/Axios/urls'
import { mapAuthorizations } from '@/app/mappings/authorizations/authorizations.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene el listado de autorizaciones pendientes por autorizador.
 * @param set Zustand setter
 * @param get Zustand getter
 * @param idAuthorizer Identificador del autorizador (employeeId)
 * @param force Forzar recarga aun si ya hay data en memoria
 */
export const getAuthorizationsByIdAuthorizer = async (
  set: SetAuthorizationsState,
  get: GetAuthorizationsState,
  idAuthorizer: string,
  force = false,
): Promise<void> => {
  if (!idAuthorizer) {
    set({
      loading: false,
      successGet: false,
      error: 'idAuthorizer requerido para cargar autorizaciones.',
    })
    return
  }

  if (get().authorizations.length > 0 && !force) return

  set({ loading: true, error: undefined, successGet: false })

  try {
    if (!get().authorizationTypes.length) {
      await get().getAuthorizationTypes?.(false)
    }

    const url = `${AuthorizationByIdAuthorizer}?idAuthorizer=${encodeURIComponent(idAuthorizer)}`
    const getReq = pGet(requireGateway('get'))
    const res: AxiosResponse = await getReq(url)
    const raw = res.data?.data ?? res.data
    const data = mapAuthorizations(Array.isArray(raw) ? raw : [])

    set({ authorizations: data, loading: false, successGet: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({
      loading: false,
      successGet: false,
      error: err.message,
    })
  }
}
