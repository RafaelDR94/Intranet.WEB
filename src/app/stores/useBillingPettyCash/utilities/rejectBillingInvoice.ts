'use client'

import type { Get, Set } from '../types'

import { BillingInvoiceReject } from '@/app/configurations/Axios/urls'
import { PutBillingsInvoiceRejectMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'
import type { PutBillingsInvoiceReject } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Rechaza una factura asociada a un vale de caja chica.
 */
export const rejectBillingInvoice = async (
  set: Set,
  get: Get,
  payload: PutBillingsInvoiceReject,
): Promise<boolean> => {
  void get
  set({ rejecting: true, error: undefined, successRejectInvoice: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const { id, comments } = PutBillingsInvoiceRejectMap(payload)
    const normalizedComment = comments.trim()
    const searchParams = new URLSearchParams({ id })

    if (normalizedComment) {
      searchParams.set('comment', normalizedComment)
    }

    const url = `${BillingInvoiceReject}?${searchParams.toString()}`

    await put(url, undefined)
    set({ rejecting: false, successRejectInvoice: true })
    return true
  } catch (e) {
    const err = normalizeApiError(e)
    set({ rejecting: false, successRejectInvoice: false, error: err.message })
    return false
  }
}
