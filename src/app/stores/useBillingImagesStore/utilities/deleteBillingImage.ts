// src/app/stores/useBillingImagesStore/utilities/deleteBillingImage.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { BillingImages as BillingImagesUrl } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Elimina una imagen de factura por ID.
 *
 * @param set Función `set`
 * @param get Función `get`
 * @param id identificador de la imagen
 */
export const deleteBillingImage = async (
  set: Set,
  get: Get,
  id: string
): Promise<boolean> => {
  set({ removing: true, error: undefined, successDelete: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    const _res: AxiosResponse = await del(`${BillingImagesUrl}/${id}`)

    set((s) => ({
      billingImages: s.billingImages.filter((b) => b.billing_image_id !== id),
      removing: false,
      successDelete: true,
    }))
    return true
  } catch (e) {
    set({ removing: false, successDelete: false, error: normalizeApiError(e).message })
    return false
  }
}
