// src/app/stores/useBillingDocumentsStore/utilities/createBillingDocument.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingValidateBillingDocument as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import type { Set, Get } from '../types'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { fetchBillingDocuments } from './fetchBillingDocuments'
import { fetchSatBillingDocument } from './fetchSatBillingDocument'

/**
 * Crea un nuevo documento de factura en el backend.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get`
 * @param ids Documentos a validar
 */
export const validateBillingDocument = async (
  set: Set,
  get: Get,
  ids: string[]
): Promise<BillingDocuments | null> => {

    set({ validating: true, error: undefined, succesValidate: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(BillingDocumentUrl, ids)
    const raw = res.data?.data
    const created = raw ? (raw as BillingDocuments) : null

    fetchBillingDocuments(set, get, true);
    fetchSatBillingDocument(set,get,true);


    set({ validating: false, succesValidate: true, error: undefined })
    return created
  } catch (e) {
    set({ validating: false, succesValidate: false, error: normalizeApiError(e).message })
    return null
  }
  
}
