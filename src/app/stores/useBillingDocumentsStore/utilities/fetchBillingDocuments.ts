// src/app/stores/useBillingDocumentsStore/utilities/fetchBillingDocuments.ts
'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingBillingDocumentByFilter as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import { BillingDocumentsMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
/**
 * Obtiene los documentos de facturas del backend y actualiza el estado.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingDocuments = async (set: Set, get: Get, force = false) => {
  if (get().billingDocuments.length > 0 && !force) return

  set({ loading: true, error: undefined, successGet: false })

  try {
    const GetFn = requireGateway('get')
    const getReq = pGet(GetFn)
    const res: AxiosResponse = await getReq(BillingDocumentUrl+"/3");
    const today = res.data?.data?.today;
    const notoday = res.data?.data?.notToday;
    const mappedtoday: BillingDocuments[] = BillingDocumentsMap(today) ?? []
    const mappednotoday: BillingDocuments[] = BillingDocumentsMap(notoday) ?? []
    set({ billingDocuments: mappedtoday,billingDocumentnotToday:mappednotoday, loading: false, successGet: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
  }
}
