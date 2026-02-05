// src/app/stores/useBillingDocumentsStore/utilities/fetchBillingDocumentById.ts
'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingDocumentByIdIdRequisition } from '@/app/configurations/Axios/urls'
import { BillingDocumentsMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
/**
 * Obtiene un documento de factura por ID.
 *
 * @param id Identificador del documento
 * @param set Función `set`
 * @param get Función `get`
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingDocumentByIdRequisition = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<BillingDocuments | null> => {
  // If we already fetched a list for this requisition and not forcing, keep cache
  if (get().billingDocuments.length > 0 && !force) return null

  set({ loading: true, error: undefined, successGet: false, successGetById: false })

  try {

    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${BillingDocumentByIdIdRequisition}/${id}`)
    const list = res.data?.data ?? []
    const mapped = BillingDocumentsMap(list);
    set({ billingDocuments: mapped, loading: false, successGet: true, successGetById: true })

    return mapped[0] ?? null
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false, successGetById: false })
    return null
  }
}
