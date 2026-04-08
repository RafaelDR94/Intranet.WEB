// src/app/stores/useBillingDocumentsStore/utilities/updateBillingDocumentJsonSap.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { fetchBillingDocumentById } from './fetchBillingDocumentById'
import { fetchSatBillingDocument } from './fetchSatBillingDocument'

import { BillingJsonSap as BillingJsonSapUrl } from '@/app/configurations/Axios/urls'
import type { BillingDocumentJsonSapPut } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const updateBillingDocumentJsonSap = async (
  set: Set,
  get: Get,
  payload: BillingDocumentJsonSapPut,
): Promise<boolean> => {
  set({ updating: true, error: undefined, successPut: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    await put(BillingJsonSapUrl, payload) as AxiosResponse

    if (payload?.Id_BillingDocument) {
      await fetchBillingDocumentById(payload.Id_BillingDocument, set, get, true)
    }
    fetchSatBillingDocument(set, get, true)

    set({ updating: false, successPut: true })
    return true
  } catch (e) {
    set({ updating: false, successPut: false, error: normalizeApiError(e).message })
    return false
  }
}

