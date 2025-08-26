// src/app/stores/useBillingDocumentsStore/utilities/createBillingDocument.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingDocument as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import type { BillingDocuments, BillingDocumentsPost } from '@/app/mappings/billingdocuments/billingdocuments.types'
import type { Set, Get } from '../types'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { fetchBillingDocuments } from './fetchBillingDocuments'

/**
 * Crea un nuevo documento de factura en el backend.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get`
 * @param payload Datos del documento a crear
 */
export const createBillingDocument = async (
  set: Set,
  get: Get,
  payload: BillingDocumentsPost
): Promise<BillingDocuments | null> => {
  set({ creating: true, error: undefined, successPost: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(BillingDocumentUrl, payload)
    const raw = res.data?.data
    const created = raw ? (raw as BillingDocuments) : null

    await fetchBillingDocuments(set, get, true)

    set({ creating: false, successPost: true, error: undefined })
    return created
  } catch (e) {
    set({ creating: false, successPost: false, error: normalizeApiError(e).message })
    return null
  }
}
