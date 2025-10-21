'use client'

import type { AxiosResponse } from 'axios'

import { BillingsCompleteProcessToSAP } from '@/app/configurations/Axios/urls'
import { mapToCompleteProcessToSAP } from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type { CompleteProcessToSAPRequest } from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Get, Set } from '../types'

export const completeProcessToSAP = async (
  set: Set,
  _get: Get,
  ids: string[],
): Promise<CompleteProcessToSAPRequest | null> => {
  if (!ids || ids.length === 0) {
    return null
  }

  set({ sending: true, error: undefined, success: false })

  try {
    const put = pPut(requireGateway('put'), [200, 201])
    const payload = mapToCompleteProcessToSAP(ids)
    const response: AxiosResponse = await put(BillingsCompleteProcessToSAP, payload)
    const data = (response?.data?.data ?? null) as CompleteProcessToSAPRequest | null

    set({ sending: false, success: true, response: data ?? payload })

    return data ?? payload
  } catch (error) {
    const normalized = normalizeApiError(error)
    set({ sending: false, success: false, error: normalized.message })
    return null
  }
}
