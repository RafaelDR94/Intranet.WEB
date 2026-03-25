'use client'
import type { AxiosResponse } from 'axios'

import type {
  BillingDocumentsFilterOptions,
  Get,
  Set,
} from '../types'

import { BillingBillingDocumentByFilter as BillingDocumentUrl } from '@/app/configurations/Axios/urls'
import { BillingDocumentsMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

const DEFAULT_FILTER: BillingDocumentsFilterOptions = { filterValue: '3' }

const normalizeFilterOptions = (
  options?: BillingDocumentsFilterOptions,
): BillingDocumentsFilterOptions => {
  if (options?.filterValue === '4' && options.idRequisition) {
    return { filterValue: '4', idRequisition: options.idRequisition }
  }

  if (options?.filterValue === '5' && options.idEmployee) {
    return { filterValue: '5', idEmployee: options.idEmployee }
  }

  if (options?.idRequisition) {
    return { filterValue: '4', idRequisition: options.idRequisition }
  }

  if (options?.idEmployee) {
    return { filterValue: '5', idEmployee: options.idEmployee }
  }

  return DEFAULT_FILTER
}

const filtersAreEqual = (
  left?: BillingDocumentsFilterOptions,
  right?: BillingDocumentsFilterOptions,
) =>
  (left?.filterValue ?? '3') === (right?.filterValue ?? '3') &&
  (left?.idRequisition ?? '') === (right?.idRequisition ?? '') &&
  (left?.idEmployee ?? '') === (right?.idEmployee ?? '')

const buildFilterUrl = (filter: BillingDocumentsFilterOptions) => {
  const normalizedFilter = normalizeFilterOptions(filter)
  const params = new URLSearchParams()

  if (normalizedFilter.filterValue === '4' && normalizedFilter.idRequisition) {
    params.set('idRequisition', normalizedFilter.idRequisition)
  }

  if (normalizedFilter.filterValue === '5' && normalizedFilter.idEmployee) {
    params.set('idEmployee', normalizedFilter.idEmployee)
  }

  const baseUrl = `${BillingDocumentUrl}/${normalizedFilter.filterValue ?? '3'}`
  const query = params.toString()
  return query ? `${baseUrl}?${query}` : baseUrl
}

/**
 * Obtiene los documentos de facturas del backend y actualiza el estado.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * @param force Fuerza la recarga ignorando cache
 * @param filterOptions Contexto de filtro para la consulta actual
 */
export const fetchBillingDocuments = async (
  set: Set,
  get: Get,
  force = false,
  filterOptions?: BillingDocumentsFilterOptions,
) => {
  const activeFilter = normalizeFilterOptions(
    filterOptions ?? get().activeDocumentsFilter,
  )
  const hasCachedDocuments =
    get().billingDocuments.length > 0 || get().billingDocumentnotToday.length > 0

  if (
    hasCachedDocuments &&
    !force &&
    filtersAreEqual(get().activeDocumentsFilter, activeFilter)
  ) {
    return
  }

  set({
    loading: true,
    error: undefined,
    successGet: false,
    activeDocumentsFilter: activeFilter,
  })

  try {
    const GetFn = requireGateway('get')
    const getReq = pGet(GetFn)
    const res: AxiosResponse = await getReq(buildFilterUrl(activeFilter))
    const today = res.data?.data?.today
    const notoday = res.data?.data?.notToday
    const mappedtoday: BillingDocuments[] = BillingDocumentsMap(today) ?? []
    const mappednotoday: BillingDocuments[] = BillingDocumentsMap(notoday) ?? []
    set({
      billingDocuments: mappedtoday,
      billingDocumentnotToday: mappednotoday,
      loading: false,
      successGet: true,
      activeDocumentsFilter: activeFilter,
    })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
  }
}
