import type { AxiosResponse } from 'axios'

import type { GetAuthorizationsState, SetAuthorizationsState } from '../types'

import { AuthorizationRequisitionHistory } from '@/app/configurations/Axios/urls'
import { mapAuthorizations } from '@/app/mappings/authorizations/authorizations.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const getRequisitionAuthorizationsHistory = async (
  set: SetAuthorizationsState,
  get: GetAuthorizationsState,
  idRequisition: string,
  force = false,
) => {
  if (!idRequisition) return []

  const cachedId = get().lastHistoryRequisitionId
  if (!force && cachedId === idRequisition && get().authorizationHistory.length > 0) {
    return get().authorizationHistory
  }

  set({
    loadingHistory: true,
    successGetHistory: false,
    error: undefined,
  })

  try {
    const getReq = pGet(requireGateway('get'))
    const url = `${AuthorizationRequisitionHistory}/${encodeURIComponent(idRequisition)}`
    const res: AxiosResponse = await getReq(url)
    const raw = res.data?.data ?? res.data
    const data = mapAuthorizations(Array.isArray(raw) ? raw : [])

    set({
      authorizationHistory: data,
      lastHistoryRequisitionId: idRequisition,
      loadingHistory: false,
      successGetHistory: true,
    })

    return data
  } catch (e) {
    const err = normalizeApiError(e)
    set({
      loadingHistory: false,
      successGetHistory: false,
      error: err.message,
    })
    return []
  }
}
