import type { AxiosResponse } from 'axios'

import type { GetAuthorizationsState, SetAuthorizationsState } from '../types'

import { AuthorizationTypes } from '@/app/configurations/Axios/urls'
import { mapAuthorizationTypes } from '@/app/mappings/authorizations/authorizations.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const getAuthorizationTypes = async (
  set: SetAuthorizationsState,
  get: GetAuthorizationsState,
  force = false,
): Promise<void> => {
  if (get().authorizationTypes.length > 0 && !force) return

  set({ loadingTypes: true, error: undefined, successGetTypes: false })

  try {
    const getReq = pGet(requireGateway('get'))
    const res: AxiosResponse = await getReq(AuthorizationTypes)
    const raw = res.data?.data ?? res.data
    const data = mapAuthorizationTypes(Array.isArray(raw) ? raw : [])

    set({
      authorizationTypes: data,
      loadingTypes: false,
      successGetTypes: true,
    })
  } catch (e) {
    const err = normalizeApiError(e)
    set({
      loadingTypes: false,
      successGetTypes: false,
      error: err.message,
    })
  }
}
