// src/app/stores/useBillingDocumentsStore/utilities/fetchBillingDocumentById.ts
'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingCategories } from '@/app/configurations/Axios/urls'
import { BillingDocumentCategoryMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocumentCategory } from '@/app/mappings/billingdocuments/billingdocuments.types'
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
export const fetchBillingDocumentCategories = async (
  set: Set,
  get: Get,
  force = false,
): Promise<BillingDocumentCategory[] | null> => {

  if (get().billingCategories?.length > 0 && !force) {
    set({ gettingCategories: false, error: undefined, succesCategories: true, billingCategories: get().billingCategories })
    return get().billingCategories
  }

  set({ gettingCategories: true, error: undefined, succesCategories: false })

  try {
  
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${BillingCategories}`)
    const data: BillingDocumentCategory[] = res.data?.data.map((billingdocument: any) => BillingDocumentCategoryMap(billingdocument))
    if (!data) {
      set({ billingCategories: undefined, gettingCategories: false, warning: 'Se recibio una respuesta vacia de Categorias' })
      return null
    }
    set({ billingCategories: data, gettingCategories: false, succesCategories: true })
    return data
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, gettingCategories: false, succesCategories: false })
    return null
  }
}
