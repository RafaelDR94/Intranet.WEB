'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { BillingAllDocumentByIdRequisition } from '@/app/configurations/Axios/urls'
import { BillingAllDocumentsByRequisitionMap } from '@/app/mappings/billingalldocuments/billingalldocuments.mapper'
import type { BillingAllDocumentsByRequisition } from '@/app/mappings/billingalldocuments/billingalldocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene el documento completo de facturación por requisición.
 *
 * @param idRequisition Identificador de la requisición
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingAllDocumentByIdRequisition = async (
  idRequisition: string,
  set: Set,
  get: Get,
  force = false,
): Promise<BillingAllDocumentsByRequisition | null> => {
  const cached = get().billingDocumentByRequisition
  const cachedId = cached?.requisition?.billingrequisition_id
  if (cachedId === idRequisition && !force) return cached

  set({
    loading: true,
    error: undefined,
    successGet: false,
    billingDocumentByRequisition: null,
  })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(
      `${BillingAllDocumentByIdRequisition}/${idRequisition}`,
    )
    const payload = res.data?.data ?? {}
    const raw = Array.isArray(payload) ? payload[0] ?? {} : payload
    const mapped = BillingAllDocumentsByRequisitionMap(raw)

    set({
      billingDocumentByRequisition: mapped,
      loading: false,
      successGet: true,
    })

    return mapped
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
    return null
  }
}
