// src/app/stores/useBillingAllDocumentsByEmployeeStore/utilities/fetchBillingAllDocumentsByIdEmployee.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { BillingAllDocumentByIdEmployee } from '@/app/configurations/Axios/urls'
import { BillingAllDocumentsByEmployeeListMap } from '@/app/mappings/billingalldocuments/billingalldocuments.mapper'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene todos los documentos de facturacion por empleado.
 *
 * @param idEmployee Identificador del empleado
 * @param set Funcion `set` de Zustand
 * @param get Funcion `get` de Zustand
 * @param force Forza la recarga ignorando cache
 */
export const fetchBillingAllDocumentsByIdEmployee = async (
  idEmployee: string,
  set: Set,
  get: Get,
  force = false,
) => {
  if (get().billingDocumentsByEmployee.length > 0 && !force) return

  set({
    loading: true,
    error: undefined,
    successGet: false,
    billingDocumentsByEmployee: [],
  })

  try {
    const getFn = requireGateway('get')
    const getReq = pGet(getFn)
    const res: AxiosResponse = await getReq(
      `${BillingAllDocumentByIdEmployee}/${idEmployee}`,
    )
    console.log("object", res.data?.data);
    const mapped = BillingAllDocumentsByEmployeeListMap(res.data?.data ?? []);
    console.log("mapped", mapped);
    set({ billingDocumentsByEmployee: mapped, loading: false, successGet: true })
  } catch (e) {
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
  }
}
