import type { AxiosResponse } from 'axios'

import type { GetAuthorizationsState, SetAuthorizationsState } from '../types'

import { AuthorizationBillingDocuments } from '@/app/configurations/Axios/urls'
import { BillingDocumentsMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const getAuthorizationBillingDocuments = async (
  set: SetAuthorizationsState,
  get: GetAuthorizationsState,
  idAuthorization: string,
  force = false,
) => {
  if (!idAuthorization) return []

  const cachedId = get().lastBillingDocumentsAuthorizationId
  if (
    !force &&
    cachedId === idAuthorization &&
    get().authorizationBillingDocuments.length > 0
  ) {
    return get().authorizationBillingDocuments
  }

  set({
    loadingBillingDocuments: true,
    successGetBillingDocuments: false,
    error: undefined,
  })

  try {
    const getReq = pGet(requireGateway('get'))
    const url = `${AuthorizationBillingDocuments}/${encodeURIComponent(idAuthorization)}`
    const res: AxiosResponse = await getReq(url)
    const raw = res.data?.data ?? res.data
    const data = BillingDocumentsMap(Array.isArray(raw) ? raw : [])

    set({
      authorizationBillingDocuments: data,
      lastBillingDocumentsAuthorizationId: idAuthorization,
      loadingBillingDocuments: false,
      successGetBillingDocuments: true,
    })

    return data
  } catch (e) {
    const err = normalizeApiError(e)
    set({
      loadingBillingDocuments: false,
      successGetBillingDocuments: false,
      error: err.message,
    })
    return []
  }
}
