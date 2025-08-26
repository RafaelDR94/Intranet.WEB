// src/app/stores/useBillingImagesStore/utilities/createBillingImage.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingImagesReject as BillingImagesUrl } from '@/app/configurations/Axios/urls'
import type { BillingImages, BillinReject } from '@/app/mappings/billingimages/billingimages.types'
import type { Set, Get } from '../types'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { fetchBillingImages } from './fetchBillingImages'

/**
 * Crea una nueva imagen de factura en el backend.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get`
 * @param payload Datos de la imagen a crear
 */
export const rejectBillingImage = async (
  set: Set,
  get: Get,
  payload: BillinReject
): Promise<BillingImages | null> => {
  set({ rejecting: true, error: undefined, succesReject: false })

  try {
 
    const put = pPut(requireGateway('put'), [200, 201])
    const res: AxiosResponse = await put(BillingImagesUrl+"?id="+payload.billing_image_id+"&comments="+payload.comments, payload)
    const raw = res.data?.data
    const created = raw ? (raw as BillingImages) : null

    await fetchBillingImages(set, get, true)

    set({ rejecting: false, succesReject: true, error: undefined })
    return created
  } catch (e) {
    set({ rejecting: false, succesReject: false, error: normalizeApiError(e).message })
    return null
  }
}
