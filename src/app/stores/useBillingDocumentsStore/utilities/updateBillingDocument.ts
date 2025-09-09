// src/app/stores/useBillingDocumentsStore/utilities/updateBillingDocument.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { fetchBillingDocumentByIdRequisition } from './fetchBillingDocumentByIdRequisition'
import { fetchBillingDocuments } from './fetchBillingDocuments'
import { fetchSatBillingDocument } from './fetchSatBillingDocument'

import { BillingDocument as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import type { BillingDocuments, BillingDocumentsPut } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Actualiza un documento de factura en el backend.
 *
 * @param set Función `set`
 * @param get Función `get`
 * @param payload Datos a actualizar
 */
export const updateBillingDocument = async (
  set: Set,
  get: Get,
  payload: BillingDocumentsPut,
  reqid?: string
): Promise<BillingDocuments | null> => {
  set({ updating: true, error: undefined, successPut: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const res: AxiosResponse = await put(BillingDocumentUrl, payload)
    const raw = res.data?.data
    const updated = raw ? (raw as BillingDocuments) : null
    if (reqid) fetchBillingDocumentByIdRequisition(reqid, set, get,true)
    else {
      fetchBillingDocuments(set, get, true);
      fetchSatBillingDocument(set, get, true);
    }
    set({ updating: false, successPut: true })
    return updated
  } catch (e) {
    set({ updating: false, successPut: false, error: normalizeApiError(e).message })
    return null
  }
}
