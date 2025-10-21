// src/app/stores/useBillingDocumentsSAPStore/utilities/fetchBillingDocumentsSAP.ts
'use client'

import type { AxiosResponse } from 'axios'

import { BillingsSAPPendingDocuments } from '@/app/configurations/Axios/urls'
import { BillingDocumentFullMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocumentFull } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Get, Set } from '../types'

const mapList = (list: unknown): BillingDocumentFull[] =>
  Array.isArray(list) ? list.map(BillingDocumentFullMap) : []

const hasCachedData = (get: Get) => {
  const state = get()
  return (
    state.billingDocumentsValid.length > 0 ||
    state.billingDocumentsNotValid.length > 0 ||
    state.billingDocumentsBadCode.length > 0 ||
    state.billingDocumentsEfos.length > 0
  )
}

/**
 * Obtiene los documentos pendientes de SAP desde el backend y actualiza el estado local.
 */
export const fetchBillingDocumentsSAP = async (
  set: Set,
  get: Get,
  force = false,
): Promise<void> => {
  if (!force && hasCachedData(get)) return

  set({ loading: true, error: undefined, successGet: false })

  try {
    const getFn = requireGateway('get')
    const getRequest = pGet(getFn)
    const response: AxiosResponse = await getRequest(BillingsSAPPendingDocuments)
    const data = response?.data?.data ?? {}

    const valid = mapList(data?.validas ?? data?.valid ?? data?.Valids)
    const notValid = mapList(data?.noValidas ?? data?.notValid ?? data?.NotValid)
    const badCode = mapList(data?.prohibidas ?? data?.badCode ?? data?.Forbidden)
    const efos = mapList(data?.efos ?? data?.Efos)

    set({
      billingDocumentsValid: valid,
      billingDocumentsNotValid: notValid,
      billingDocumentsBadCode: badCode,
      billingDocumentsEfos: efos,
      loading: false,
      successGet: true,
    })
  } catch (error) {
    const normalized = normalizeApiError(error)
    set({ error: normalized.message, loading: false, successGet: false })
  }
}
