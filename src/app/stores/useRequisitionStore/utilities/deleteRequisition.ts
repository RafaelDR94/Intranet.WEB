// src/app/stores/useRequisitionStore/utilities/deleteRequisition.ts
'use client'
import type { AxiosResponse } from 'axios'

import type { Set, Get } from '../types'

import { BillingRequisition } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Elimina una requisición por ID.
 *
 * @param set función `set`
 * @param get función `get`
 * @param id identificador de la requisición
 */
export const deleteRequisition = async (
  set: Set,
  get: Get,
  id: string
): Promise<boolean> => {
  set({ removing: true, error: undefined, successDelete: false })

  try {
    // Acepta 200 y 204 como OK
    const del = pDelete(requireGateway('del'), [200, 204])
    const _res: AxiosResponse = await del(`${BillingRequisition}/${id}`)

    set((s) => ({
      requisitions: s.requisitions.filter((r) => r.billingrequisition_id !== id),
      removing: false,
      successDelete: true,
    }))
    return true
  } catch (e) {
    set({ removing: false, successDelete: false, error: normalizeApiError(e).message })
    return false
  }
}
