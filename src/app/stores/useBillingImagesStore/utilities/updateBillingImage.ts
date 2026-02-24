// src/app/stores/useBillingImagesStore/utilities/updateBillingImage.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { fetchBillingImages } from './fetchBillingImages'

import { BillingImages as BillingImagesUrl } from '@/app/configurations/Axios/urls'
import { BillingPutMap } from '@/app/mappings/billingimages/billingimages.mapper'
import type { BillingImages, BillingPut } from '@/app/mappings/billingimages/billingimages.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'



/**
 * Actualiza una imagen de factura en el backend.
 *
 * @param set Función `set`
 * @param get Función `get`
 * @param payload Datos a actualizar
 */
export const updateBillingImage = async (
  set: Set,
  get: Get,
  payload: BillingPut
): Promise<BillingImages | null> => {
  set({ updating: true, error: undefined, successPut: false })

  try {
    const put = pPut(requireGateway('put'), [200, 204])
    const res: AxiosResponse = await put(BillingImagesUrl, BillingPutMap(payload))
    const raw = res.data?.data
    const updated = raw ? (raw as BillingImages) : null

    const employeeId = get().billingImagesEmployeeId
    if (employeeId) await fetchBillingImages(set, get, employeeId, true)

    set({ updating: false, successPut: true })
    return updated
  } catch (e) {
    set({ updating: false, successPut: false, error: normalizeApiError(e).message })
    return null
  }
}
