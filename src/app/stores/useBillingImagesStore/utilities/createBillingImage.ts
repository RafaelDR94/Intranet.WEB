// src/app/stores/useBillingImagesStore/utilities/createBillingImage.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { fetchBillingImages } from './fetchBillingImages'

import { BillingImages as BillingImagesUrl } from '@/app/configurations/Axios/urls'
import { BillingPostMap } from '@/app/mappings/billingimages/billingimages.mapper'
import type { BillingImages, BillingPost } from '@/app/mappings/billingimages/billingimages.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'


/**
 * Crea una nueva imagen de factura en el backend.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get`
 * @param payload Datos de la imagen a crear
 */
export const createBillingImage = async (
  set: Set,
  get: Get,
  payload: BillingPost
): Promise<BillingImages | null> => {
  set({ creating: true, error: undefined, successPost: false })

  try {
 
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(BillingImagesUrl, BillingPostMap(payload))
    const raw = res.data?.data
    const created = raw ? (raw as BillingImages) : null

    await fetchBillingImages(set, get, true)

    set({ creating: false, successPost: true, error: undefined })
    return created
  } catch (e) {
    set({ creating: false, successPost: false, error: normalizeApiError(e).message })
    return null
  }
}
