'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { BillingRequisition } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pDelete } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Elimina una requisición y actualiza el listado local.
 */
export const deleteBillingRequisitionWithEmployees = async (
  set: Set,
  get: Get,
  idRequisition: string,
): Promise<boolean> => {
  set({ removing: true, error: undefined, successDelete: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    const _res: AxiosResponse = await del(`${BillingRequisition}/${idRequisition}`)

    set((s) => ({
      requisitions: s.requisitions.filter((r) => {
        const record = r as Record<string, unknown>
        const requisitionId = String(
          record.id_requisition ?? record.billingrequisition_id ?? '',
        )
        return requisitionId !== idRequisition
      }),
      removing: false,
      successDelete: true,
    }))
    return true
  } catch (e) {
    set({ removing: false, successDelete: false, error: normalizeApiError(e).message })
    return false
  }
}
