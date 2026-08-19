'use client'

import type { AxiosResponse } from 'axios'

import { BillingsCompleteProcessToSAP } from '@/app/configurations/Axios/urls'
import {
  mapCompleteProcessToSAPResponse,
  mapToCompleteProcessToSAP,
} from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { CompleteProcessToSAPResponse } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Get, Set } from '../types'

const buildDocumentsErrorMessage = (data: CompleteProcessToSAPResponse): string | undefined => {
  const documentErrors = data.documents
    .map((document) => document.errorMessage.trim())
    .filter(Boolean)

  if (documentErrors.length > 0) {
    return documentErrors.join('\n')
  }

  return data.message.trim() || undefined
}

const getErrorDetailsData = (error: unknown, normalizedDetails: unknown): unknown => {
  if (error && typeof error === 'object' && 'details' in error) {
    const details = (error as { details?: { data?: unknown } }).details
    return details?.data
  }

  if (normalizedDetails && typeof normalizedDetails === 'object' && 'data' in normalizedDetails) {
    return (normalizedDetails as { data?: unknown }).data
  }

  return undefined
}

export const completeProcessToSAP = async (
  set: Set,
  _get: Get,
  ids: string[],
): Promise<CompleteProcessToSAPResponse | null> => {
  if (!ids || ids.length === 0) {
    return null
  }

  set({ sending: true, error: undefined, success: false })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const payload = mapToCompleteProcessToSAP(ids)
    const response: AxiosResponse = await post(BillingsCompleteProcessToSAP, payload)
    const data = mapCompleteProcessToSAPResponse(response?.data?.data)
    const errorMessage = response.status === 201 ? buildDocumentsErrorMessage(data) : undefined
    const shouldShowSuccess = response.status === 200 && data.documents.length > 0

    set({
      sending: false,
      success: shouldShowSuccess,
      error: errorMessage,
      response: data,
    })

    return data
  } catch (error) {
    const normalized = normalizeApiError(error)
    const data = mapCompleteProcessToSAPResponse(getErrorDetailsData(error, normalized.details))
    const errorMessage = buildDocumentsErrorMessage(data) ?? normalized.message

    set({
      sending: false,
      success: false,
      error: errorMessage,
      response: data.documents.length > 0 || data.message ? data : null,
    })

    return null
  }
}
