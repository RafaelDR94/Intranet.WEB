'use client'
import type { AxiosResponse } from 'axios'

import type { Get, Set } from '../types'

import { fetchBillingDocumentByIdRequisition } from './fetchBillingDocumentByIdRequisition'
import { fetchBillingDocuments } from './fetchBillingDocuments'
import { fetchSatBillingDocument } from './fetchSatBillingDocument'

import { BillingDocumentNotDeductible as BillingDocumentNotDeductibleUrl } from '@/app/configurations/Axios/urls'
import {
  BillingDocumentNotDeductibleMap,
} from '@/app/mappings/billingdocuments/billingdocuments.mapper'
import type {
  BillingDocumentNotDeductible,
  BillingDocuments,
} from '@/app/mappings/billingdocuments/billingdocuments.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const billingDocumentNotDeductible = async (
  set: Set,
  get: Get,
  payload: BillingDocumentNotDeductible,
): Promise<BillingDocuments | null> => {
  set({
    notDeducting: true,
    successNotDeductible: false,
    error: undefined,
  })

  try {
    const post = pPost(requireGateway('post'), [200, 201])
    const res: AxiosResponse = await post(
      BillingDocumentNotDeductibleUrl,
      BillingDocumentNotDeductibleMap(payload),
    )
    const raw = res.data?.data
    const created = raw ? (raw as BillingDocuments) : null

    if (payload.requisition_id) {
      await fetchBillingDocumentByIdRequisition(
        payload.requisition_id,
        set,
        get,
        true,
      )
    } else {
      await fetchBillingDocuments(set, get, true)
    }
    await fetchSatBillingDocument(set, get, true)

    set({
      notDeducting: false,
      successNotDeductible: true,
      error: undefined,
    })
    return created
  } catch (e) {
    set({
      notDeducting: false,
      successNotDeductible: false,
      error: normalizeApiError(e).message,
    })
    return null
  }
}
