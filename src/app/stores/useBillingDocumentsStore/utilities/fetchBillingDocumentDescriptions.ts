// src/app/stores/useBillingDocumentsStore/utilities/fetchBillingDocumentById.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingDescription } from '@/app/configurations/Axios/urls'
import type { BillingDocumentDescription } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { Get, Set } from '../types'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { BillingDocumentDescriptionMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
/**
 * Obtiene un documento de factura por ID.
 *
 * @param id Identificador del documento
 * @param set Función `set`
 * @param get Función `get`
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingDocumentDescriptions = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<BillingDocumentDescription[] | null> => {

  if (get().billingDocumentDescription?.length > 0 && !force) {
    set({ gettingDescriptions: false, error: undefined, succesDescriptions: true, billingDocumentDescription: get().billingDocumentDescription })
    return get().billingDocumentDescription
  }
  set({ gettingDescriptions: true, error: undefined, succesDescriptions: false })

  try {

    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${BillingDescription}/${id}`)
    const data: BillingDocumentDescription[] = res.data?.data.map((billingdocument: any) => BillingDocumentDescriptionMap(billingdocument))
    if (!data) {
      set({ billingDocumentDescription: undefined, gettingDescriptions: false, warning: 'Se recibio una respuesta vacia de Documentos' })
      return null
    }
    set({ billingDocumentDescription: data, gettingDescriptions: false, succesDescriptions: true })
    return data
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGetById: false })
    return null
  }
}
