// src/app/stores/useBillingDocumentsStore/utilities/fetchBillingDocuments.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingSATBillingDocument as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import { Get, Set } from '../types'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { BillingDocumentsMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
/**
 * Obtiene los documentos de facturas del backend y actualiza el estado.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * @param force Forza la recarga ignorando cache
 */
export const fetchSatBillingDocument = async (set: Set, get: Get, force = false) => {
  if (get().billingDocuments?.length > 0 && !force) return

  set({ loadigSat: true, error: undefined, successGetSat: false })

  try {
    const GetFn = requireGateway('get')
    const getReq = pGet(GetFn)
    const res: AxiosResponse = await getReq(BillingDocumentUrl)
    const valid = BillingDocumentsMap(res.data?.data?.validas)?? []
    const notvalid = BillingDocumentsMap(res.data?.data?.noValidas)?? []
    const bad = BillingDocumentsMap(res.data?.data?.prohibidas)?? []
    const efos = BillingDocumentsMap(res.data?.data?.efos)?? []

    set({ billingDocumentsValid: valid,billingDocumentsNotValid:notvalid,billingDocumentsBadCode:bad,billingDocumentsEfos:efos, loadigSat: false, successGetSat: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loadigSat: false, successGetSat: false })
  }
}
