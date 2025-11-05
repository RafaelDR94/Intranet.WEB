'use client'

import type { PutPettyCashRejectAuthorizationEvidence } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import { PutPettyCashRejectAuthorizationEvidenceMap } from '@/app/mappings/billingPettyCash/billingPettyCash.mapper'

import { BillingPettyCashVoucherRejectAuthorizationEvidence } from '../../../configurations/Axios/urls'
import type { Set } from '../types'

import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

/**
 * Rechaza la evidencia de autorización de un vale de caja chica.
 */
export const rejectAuthorizationEvidence = async (
  set: Set,
  payload: PutPettyCashRejectAuthorizationEvidence,
): Promise<boolean> => {
  const mapped = PutPettyCashRejectAuthorizationEvidenceMap(payload)
  const id = mapped.id.trim()
  const comment = mapped.comment.trim()

  if (!id) {
    set({
      rejecting: false,
      successRejectAuthorizationEvidence: false,
      successRejectVoucher: false,
      error: 'No se encontró el identificador del vale a rechazar.',
    })
    return false
  }

  if (!comment) {
    set({
      rejecting: false,
      successRejectAuthorizationEvidence: false,
      successRejectVoucher: false,
      error: 'Agrega un comentario para rechazar la evidencia de autorización.',
    })
    return false
  }

  set({
    rejecting: true,
    error: undefined,
    successRejectAuthorizationEvidence: false,
    successRejectVoucher: false,
  })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const url = `${BillingPettyCashVoucherRejectAuthorizationEvidence}?id=${encodeURIComponent(
      id,
    )}&comment=${encodeURIComponent(comment)}`
    await put(url, undefined)
    set({ rejecting: false, successRejectAuthorizationEvidence: true })
    return true
  } catch (error) {
    const normalized = normalizeApiError(error)
    set({
      rejecting: false,
      successRejectAuthorizationEvidence: false,
      successRejectVoucher: false,
      error: normalized.message,
    })
    return false
  }
}
