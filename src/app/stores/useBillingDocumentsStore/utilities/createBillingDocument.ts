// src/app/stores/useBillingDocumentsStore/utilities/createBillingDocument.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { fetchBillingDocuments } from './fetchBillingDocuments'

import { BillingDocument as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import { BillingDocumentsPostMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocuments, BillingDocumentsPost } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'


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
    const res: AxiosResponse = await post(BillingDocumentUrl, BillingDocumentsPostMap(payload))
    const responseData = res.data ?? {}
    const responseSuccess = responseData?.success
    const responseErrorMessage = responseData?.error_Message ?? responseData?.message
    const raw = res.data?.data

    if (responseSuccess === false || (!raw && responseErrorMessage)) {
      set({
        creating: false,
        successPost: false,
        error: responseErrorMessage || 'No se pudo crear la factura',
      })
      return null
    }

    const created = raw ? (raw as BillingDocuments) : null

    await fetchBillingDocuments(set, get, true)

    set({ creating: false, successPost: true, error: undefined })
    return created
  } catch (e) {
    set({ creating: false, successPost: false, error: normalizeApiError(e).message })
    return null
  }
}
