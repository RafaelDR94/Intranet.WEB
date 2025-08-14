// src/app/stores/useRequisitionStore/utilities/createRequisition.ts
'use client'
import type { AxiosResponse } from 'axios'
import { BillingRequisition } from '@/app/configurations/Axios/urls'
import { RequisitionMap } from '@/app/mappings/requisitions/requisitions.mapp'
import type { Requisition, RequitionPost } from '@/app/mappings/requisitions/requisitions.types'
import type { Set, Get } from '../types'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { fetchRequisitions } from './fetchRequisitions'

/**
 * Crea una nueva requisición en el backend.
 *
 * @param set Función `set` de Zustand
 * @param get Función `get`
 * @param payload Datos de la requisición a crear
 */
export const createRequisition = async (
  set: Set,
  get: Get,
  payload: RequitionPost
): Promise<Requisition | null> => {
  set({ creating: true, error: undefined, successPost: false })

  try {
    // Acepta 200 y 201 como OK explícitamente
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(BillingRequisition, payload)

    const raw = res.data?.data
    const created = raw ? RequisitionMap(raw) : null
 

    // Refetch para asegurar consistencia si la API no regresa todo
    await fetchRequisitions(set, get, true)

    set({ creating: false, successPost: true, error: undefined })
    return created
  } catch (e) {
    set({ creating: false, successPost: false, error: normalizeApiError(e).message })
    return null
  }
}
