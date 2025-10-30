// src/app/stores/useBillingImagesStore/utilities/fetchBillingImages.ts
'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingImages as BillingImagesUrl } from '@/app/configurations/Axios/urls'
import { BillingImagesMap } from '@/app/mappings/billingimages/billingimages.mapper'
import type { BillingImages } from '@/app/mappings/billingimages/billingimages.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
/**
 * Obtiene las imágenes de facturas del backend y actualiza el estado.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingImages = async (set: Set, get: Get, force = false) => {
  if (get().billingImages.length > 0 && !force) return

  set({ loading: true, error: undefined, successGet: false })

  try {
    const GetFn = requireGateway('get')
    const getReq = pGet(GetFn)
    const res: AxiosResponse = await getReq(BillingImagesUrl)
    const mapped: BillingImages[] = BillingImagesMap(res.data?.data) ?? []
    set({ billingImages: mapped, loading: false, successGet: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
  }
}
