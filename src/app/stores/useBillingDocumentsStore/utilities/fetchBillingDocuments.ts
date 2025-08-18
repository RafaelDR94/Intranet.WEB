// src/app/stores/useBillingDocumentsStore/utilities/fetchBillingDocuments.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingDocument as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { Get, Set } from '../types'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'

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
    const res: AxiosResponse = await getReq(BillingDocumentUrl)
    const mapped: BillingDocuments[] = res.data?.data ?? []
    set({ billingDocuments: mapped, loading: false, successGet: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
  }
}
