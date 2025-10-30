// src/app/stores/useBillingDocumentsStore/utilities/createBillingDocument.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { fetchBillingDocumentByIdRequisition } from './fetchBillingDocumentByIdRequisition'
import { fetchBillingDocuments } from './fetchBillingDocuments'
import { fetchSatBillingDocument } from './fetchSatBillingDocument'

import { BillingValidateBillingDocumentOperations as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Crea un nuevo documento de factura en el backend.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get`
 * @param ids Documentos a validar
 */
export const validateBillingDocumentOperations = async (
  set: Set,
  get: Get,
  ids: string[],
  reqid?:string
): Promise<BillingDocuments | null> => {

    set({ validating: true, error: undefined, succesValidate: false })

  try {
    const post = pPut(requireGateway('put'), [200, 201])
    const res: AxiosResponse = await post(BillingDocumentUrl, ids)
    const raw = res.data?.data
    const created = raw ? (raw as BillingDocuments) : null

    if (reqid) fetchBillingDocumentByIdRequisition(reqid, set, get,true)
    else {
      fetchBillingDocuments(set, get, true);
      fetchSatBillingDocument(set, get, true);
    }


    set({ validating: false, succesValidate: true, error: undefined })
    return created
  } catch (e) {
    set({ validating: false, succesValidate: false, error: normalizeApiError(e).message })
    return null
  }
  
}
