// src/app/stores/useBillingDocumentsStore/utilities/fetchBillingDocuments.ts
'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set, SatBillingDocumentsFilterOptions } from '../types'

import {
  BillingSATBillingDocument as BillingDocumentUrl,
  BillingSATBillingDocumentByEmployee,
  BillingSATBillingDocumentByRequisition,
} from '@/app/configurations/Axios/urls'
import { BillingDocumentsMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
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
const resolveSatBillingUrl = (filterOptions?: SatBillingDocumentsFilterOptions): string => {
  if (filterOptions?.idRequisition) {
    return `${BillingSATBillingDocumentByRequisition}/${encodeURIComponent(filterOptions.idRequisition)}`
  }

  if (filterOptions?.idEmployee) {
    return `${BillingSATBillingDocumentByEmployee}/${encodeURIComponent(filterOptions.idEmployee)}`
  }

  return BillingDocumentUrl
}

export const fetchSatBillingDocument = async (
  set: Set,
  get: Get,
  force = false,
  filterOptions?: SatBillingDocumentsFilterOptions,
) => {
  if (get().billingDocuments?.length > 0 && !force) return

  set({ loadigSat: true, error: undefined, successGetSat: false })

  try {
    const GetFn = requireGateway('get')
    const getReq = pGet(GetFn)
    const res: AxiosResponse = await getReq(resolveSatBillingUrl(filterOptions))
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
