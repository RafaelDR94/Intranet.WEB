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
  id: string,
): Promise<boolean> => {
  set({ removing: true, error: undefined, successDelete: false })

  try {
    const del = pDelete(requireGateway('del'), [200, 204])
    const _res: AxiosResponse = await del(`${BillingRequisition}/${id}`)

    set((s) => ({
      requisitions: s.requisitions.filter((r) => {
        const record = r as Record<string, unknown>
        const requisitionId = String(record.billingrequisition_id ?? '')
        const employeeId = String(record.id_employee ?? record.id_Employee ?? '')
        const resolvedId = requisitionId || employeeId
        return resolvedId !== id
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
