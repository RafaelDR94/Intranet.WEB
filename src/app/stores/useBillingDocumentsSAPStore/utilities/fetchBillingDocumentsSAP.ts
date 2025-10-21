'use client'

import type { AxiosResponse } from 'axios'

import { BillingsSAPPendingDocuments } from '@/app/configurations/Axios/urls'
import { BillingDocumentFullMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocumentFull } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Get, Set } from '../types'

/**
 * Mapea un único documento o una lista de documentos completos.
 */
const mapDocuments = (data: unknown): BillingDocumentFull[] => {
  if (!data) return []
  if (Array.isArray(data)) return data.map(BillingDocumentFullMap)
  return [BillingDocumentFullMap(data)]
}

/**
 * Verifica si ya hay datos cacheados en el estado.
 */
const hasCachedData = (get: Get) => {
  const state = get()
  return state.billingDocuments?.length > 0
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

    console.log('data fetch', data)

    // 🔹 Mapeamos directamente el objeto o lista de documentos
    const billingDocuments = mapDocuments(data)

    set({
      billingDocuments,
      loading: false,
      successGet: true,
    })
  } catch (error) {
    const normalized = normalizeApiError(error)
    set({ error: normalized.message, loading: false, successGet: false })
  }
}
