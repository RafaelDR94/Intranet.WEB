// src/app/stores/useBillingDocumentsStore/utilities/createBillingDocument.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingDocumentsSendToSAP as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
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
export const sendToSapBillingDocument = async (
  set: Set,
  get: Get,
  ids: string[]
): Promise<BillingDocuments | null> => {
  set({ sending: true, error: undefined, succesSend: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(BillingDocumentUrl, ids)
    const raw = res.data?.data
    const created = raw ? (raw as BillingDocuments) : null

    fetchBillingDocuments(set, get, true);
    fetchSatBillingDocument(set, get, true);


    set({ sending: false, succesSend: true, error: undefined })
    return created
  } catch (e) {
    set({ sending: false, succesSend: false, error: normalizeApiError(e).message })
    return null
  }
}
