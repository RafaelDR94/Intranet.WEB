// src/app/stores/useBillingImagesByEmployeeStore/utilities/fetchBillingImagesByIdEmployee.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { BillingImagesByIdEmployee } from '@/app/configurations/Axios/urls'
import { BillingImagesByEmployeeMap } from '@/app/mappings/billingimages/billingimages.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene las imÃ¡genes de facturaciÃ³n por empleado.
 *
 * @param idEmployee Identificador del empleado
 * @param set FunciÃ³n `set` de Zustand
 * @param get FunciÃ³n `get` de Zustand
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingImagesByIdEmployee = async (
  idEmployee: string,
  set: Set,
  get: Get,
  force = false,
) => {
  if (get().billingImagesByEmployee.length > 0 && !force) return

  set({
    loading: true,
    error: undefined,
    successGet: false,
    billingImagesByEmployee: [],
  })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(
      `${BillingImagesByIdEmployee}?idEmployee=${idEmployee}`,
    )
    const mapped = BillingImagesByEmployeeMap(res.data?.data ?? [])
    set({ billingImagesByEmployee: mapped, loading: false, successGet: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
  }
}
