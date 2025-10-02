'use client'

import { Set } from '../types'

import { BillingPettyCashVoucherReject } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Rechaza un vale de caja chica.
 */
export const rejectPettyCashVoucher = async (
  set: Set,
  id: string,
  comments = ''
): Promise<boolean> => {
  set({ rejecting: true, error: undefined, successRejectVoucher: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const normalizedComment = comments.trim()
    const query = normalizedComment ? `&comment=${encodeURIComponent(normalizedComment)}` : ''
    const url = `${BillingPettyCashVoucherReject}?id=${id}${query}`
    await put(url, undefined)
    set({ rejecting: false, successRejectVoucher: true })
    return true
  } catch (e) {
    const err = normalizeApiError(e)
    set({ rejecting: false, successRejectVoucher: false, error: err.message })
    return false
  }
}

