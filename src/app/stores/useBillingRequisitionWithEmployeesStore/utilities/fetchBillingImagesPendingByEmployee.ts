'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { BillingImagesPendingByEmployee as BillingImagesPendingByEmployeeUrl } from '@/app/configurations/Axios/urls'
import { BillingImagesMap } from '@/app/mappings/billingimages/billingimages.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene los tickets pendientes por empleado.
 * @param idEmployee Identificador del empleado.
 * @param set Zustand setter.
 * @param get Zustand getter.
 * @param force Ignora cache local si es true.
 */
export const fetchBillingImagesPendingByEmployee = async (
  idEmployee: string,
  set: Set,
  get: Get,
  force = false,
) => {
  if (!idEmployee) return

  if (
    !force &&
    get().pendingBillingImages.length > 0 &&
    get().pendingImagesEmployeeId === idEmployee
  ) {
    return
  }

  set({
    loadingPendingImages: true,
    errorPendingImages: undefined,
    successGetPendingImages: false,
    pendingBillingImages: [],
    pendingImagesEmployeeId: idEmployee,
  })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(
      `${BillingImagesPendingByEmployeeUrl}/${idEmployee}`,
    )
    const payload = res.data?.data ?? res.data ?? []
    const list = Array.isArray(payload)
      ? payload
      : payload?.images ??
        payload?.billingImages ??
        payload?.data ??
        []
    console.log(res);
    console.log(payload);
    console.log(list);
    const mapped = BillingImagesMap(list)
    set({
      pendingBillingImages: mapped,
      loadingPendingImages: false,
      successGetPendingImages: true,
    })
  } catch (e) {
    const err = normalizeApiError(e)
    set({
      errorPendingImages: err.message,
      loadingPendingImages: false,
      successGetPendingImages: false,
    })
  }
}
