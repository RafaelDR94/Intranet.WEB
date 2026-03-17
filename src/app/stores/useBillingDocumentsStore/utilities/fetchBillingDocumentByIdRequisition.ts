// src/app/stores/useBillingDocumentsStore/utilities/fetchBillingDocumentById.ts
'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingDocumentByIdIdRequisition } from '@/app/configurations/Axios/urls'
import { BillingDocumentsMap } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { BillingDocuments } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const toNumberSafe = (value: unknown): number => {
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : 0
}

const extractBillingDocumentsPayload = (
  rootData: unknown,
): Record<string, unknown> | null => {
  let current: unknown = rootData
  for (let i = 0; i < 3; i += 1) {
    if (!isRecord(current)) return null
    if (Array.isArray(current.billingDocuments)) return current
    current = current.data
  }
  return null
}
/**
 * Obtiene un documento de factura por ID.
 *
 * @param id Identificador del documento
 * @param set Función `set`
 * @param get Función `get`
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingDocumentByIdRequisition = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<BillingDocuments | null> => {
  // If we already fetched a list for this requisition and not forcing, keep cache
  if (get().billingDocuments.length > 0 && !force) return null

  set({
    loading: true,
    error: undefined,
    successGet: false,
    successGetById: false,
    billingDocuments: [],
    montoComprobado: 0,
    montoAFavorEmpresa: 0,
    montoAFavorColaborador: 0,
    hasPerDiemTotals: false,
  })

  try {

    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${BillingDocumentByIdIdRequisition}/${id}`)

    // Legacy shape: res.data.data = BillingDocuments[]
    // New shape: res.data.data.data.billingDocuments = BillingDocuments[] + montos
    const rootData = res.data?.data
    const payload = extractBillingDocumentsPayload(rootData)
    const list = Array.isArray(payload?.billingDocuments)
      ? payload?.billingDocuments
      : rootData

    const mapped = BillingDocumentsMap(Array.isArray(list) ? list : [])

    const hasPerDiemTotals = Boolean(
      payload &&
        ('montoComprobado' in payload ||
          'montoAFavorEmpresa' in payload ||
          'montoAFavorColaborador' in payload),
    )

    set({
      billingDocuments: mapped,
      montoComprobado: toNumberSafe(payload?.montoComprobado),
      montoAFavorEmpresa: toNumberSafe(payload?.montoAFavorEmpresa),
      montoAFavorColaborador: toNumberSafe(payload?.montoAFavorColaborador),
      hasPerDiemTotals,
      loading: false,
      successGet: true,
      successGetById: true,
    })

    return mapped[0] ?? null
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false, successGetById: false })
    return null
  }
}
