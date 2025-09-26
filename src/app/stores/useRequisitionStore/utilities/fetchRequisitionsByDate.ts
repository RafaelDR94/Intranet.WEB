// src/app/stores/useRequisitionStore/utilities/fetchRequisitions.ts
'use client'

import { AxiosResponse } from 'axios'

import { Get, Set } from '../types'

import { BillingRequisitionByDate} from '@/app/configurations/Axios/urls'
import { RequisitionsMap } from '@/app/mappings/requisitions/requisitions.mapp'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Obtiene las requisiciones activas del backend y actualiza el estado.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get` de Zustand
 * @param force Forza la recarga ignorando cache
 */
export const fetchRequisitionsByDate = async (startDate: string, endDate: string, set: Set, get: Get, force = false) => {
  // cache básica
  if (get().requisitions.length > 0 && !force) return

  set({ loading: true, error: undefined, successGet: false, requisitions: [] })


  try {
    // 1) Obtiene GET del gateway (lanza si no está listo)
    const GetFn = requireGateway('get')

    // 2) promisify con rango OK por defecto 200–299
    const getReq = pGet(GetFn)

    // 3) llamada
    const res: AxiosResponse = await getReq(`${BillingRequisitionByDate}?startDate=${startDate}&endDate=${endDate}`)
    
    // 4) mapear y guardar
    const mapped = RequisitionsMap(res.data?.data ?? [])

    set({ requisitions: mapped, loading: false, successGet: true })
  } catch (e) {
    // 5) error normalizado
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
  }
}
