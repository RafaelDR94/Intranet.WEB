// src/app/stores/useBillingDocumentsStore/utilities/fetchBillingDocumentById.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingDocumentById } from '@/app/configurations/Axios/urls'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { Get, Set } from '../types'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { BillingDocumentMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
/**
 * Obtiene un documento de factura por ID.
 *
 * @param id Identificador del documento
 * @param set Función `set`
 * @param get Función `get`
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingDocumentById = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<BillingDocuments | null> => {
  if (get().billingDocument && get().billingDocument?.billingdocument_id === id && !force) {
    return get().billingDocument ?? null
  }

  set({ loading: true, error: undefined, successGetById: false })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${BillingDocumentById}/${id}`)
    const data: BillingDocuments | undefined = BillingDocumentMap(res.data?.data);
    if (!data) {
      set({ billingDocument: undefined, loading: false, warning: 'Documento no encontrado' })
      return null
    }
    set({ billingDocument: data, loading: false, successGetById: true })
    return data
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGetById: false })
    return null
  }
}
