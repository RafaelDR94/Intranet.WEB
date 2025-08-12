// src/app/stores/useRequisitionStore/utilities/updateRequisition.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingRequisition } from '@/app/configurations/Axios/urls'
import { RequisitionMap } from '@/app/mappings/requisitions/requisitions.mapp'
import type { Requisition, RequitionPut } from '@/app/mappings/requisitions/requisitions.types'
import type { Get, Set } from '../types'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { fetchRequisitions } from './fetchRequisitions'

/**
 * Actualiza una requisición existente.
 *
 * @param set función `set` de Zustand
 * @param get función `get`
 * @param payload datos de la requisición a actualizar
 */
export const updateRequisition = async (
  set: Set,
  get: Get,
  payload: RequitionPut
): Promise<Requisition | null> => {
  set({ updating: true, error: undefined, successPut: false })

  try {
    const id = payload.id_billingrequisition
    const put = pPut(requireGateway('put')) // 200–299 OK por defecto
    const res: AxiosResponse = await put(`${BillingRequisition}/${id}`, payload)

    const raw = res.data?.data
    const updated = raw ? RequisitionMap(raw) : undefined

    if (updated) {
      set((s) => ({
        requisitions: s.requisitions.map((r) =>
          r.id_billingrequisition === updated.id_billingrequisition ? updated : r
        ),
        updating: false,
        successPut: true,
      }))
      return updated
    }

    // Si la API no regresó el recurso actualizado, refetch
    await fetchRequisitions(set, get, true)
    set({ updating: false, successPut: true })
    return null
  } catch (e) {
    set({ updating: false, successPut: false, error: normalizeApiError(e).message })
    return null
  }
}
