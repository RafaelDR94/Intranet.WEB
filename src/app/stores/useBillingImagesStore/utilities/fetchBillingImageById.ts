// src/app/stores/useBillingImagesStore/utilities/fetchBillingImageById.ts
'use client'
import type { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingImagesById } from '@/app/configurations/Axios/urls'
import type { BillingImages } from '@/app/mappings/billingimages/billingimages.types'
import { BillingImageMap } from '@/app/mappings/billingimages/billingimages.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene una imagen de factura por ID.
 *
 * @param id Identificador de la imagen
 * @param set Función `set`
 * @param get Función `get`
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingImageById = async (
  id: string,
  set: Set,
  get: Get,
  force = false,
): Promise<BillingImages | null> => {
  if (get().billingImage && get().billingImage?.billing_image_id === id && !force) {
    return get().billingImage ?? null
  }

  set({ loading: true, error: undefined, successGetById: false })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(`${BillingImagesById}/${id}`)
    const raw = res.data?.data
    const data: BillingImages | undefined = raw ? BillingImageMap(raw) : undefined
    if (!data) {
      set({ billingImage: undefined, loading: false, warning: 'Imagen no encontrada' })
      return null
    }
    set({ billingImage: data, loading: false, successGetById: true })
    return data
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGetById: false })
    return null
  }
}
