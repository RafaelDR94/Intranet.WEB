// src/app/stores/useBillingDocumentsStore/utilities/createBillingDocument.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingRejectBillingDocument as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import type { Set, Get } from '../types'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { fetchBillingDocuments } from './fetchBillingDocuments'
import { BillingDocumentReject } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { fetchSatBillingDocument } from './fetchSatBillingDocument'
import { fetchBillingDocumentByIdRequisition } from './fetchBillingDocumentByIdRequisition'
/**
 * Crea un nuevo documento de factura en el backend.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get`
 * @param payload Datos del documento a crear
 */
export const rejectBillingDocument = async (
  set: Set,
  get: Get,
  payload: BillingDocumentReject,
  reqid?: string
): Promise<BillingDocuments | null> => {
  set({ rejecting: true, error: undefined, succesReject: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const res: AxiosResponse = await put(BillingDocumentUrl + "?id=" + payload.id + "&comment=" + payload.comment + "&type=" + payload.type, payload)
    const raw = res.data?.data
    const created = raw ? (raw as BillingDocuments) : null

    if (reqid) fetchBillingDocumentByIdRequisition(reqid, set, get, true)
    else {
      fetchBillingDocuments(set, get, true);
      fetchSatBillingDocument(set, get, true);
    }

    set({ rejecting: false, succesReject: true, error: undefined })
    return created
  } catch (e) {
    set({ rejecting: false, succesReject: false, error: normalizeApiError(e).message })
    return null
  }
}
