// src/app/stores/useRequisitionStore/utilities/fetchRequisitions.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingRequisition } from '@/app/configurations/Axios/urls'
import { RequisitionsMap } from '@/app/mappings/requisitions/requisitions.mapp'
import { Get,Set } from '../types'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'

export const fetchRequisitions = async (set: Set, get: Get, force = false) => {
  // cache básica
  if (get().requisitions.length > 0 && !force) return

  set({ loading: true, error: undefined, successGet: false })

  try {
    // 1) Obtiene GET del gateway (lanza si no está listo)
    const GetFn = requireGateway('get')

    // 2) promisify con rango OK por defecto 200–299
    const getReq = pGet(GetFn)

    // 3) llamada
    const res: AxiosResponse = await getReq(`${BillingRequisition}?IsActive=true`)

    // 4) mapear y guardar
    const mapped = RequisitionsMap(res.data?.data ?? [])
    set({ requisitions: mapped, loading: false, successGet: true })
  } catch (e) {
    // 5) error normalizado
    const err = normalizeApiError(e)
    set({ error: err.message, loading: false, successGet: false })
  }
}
