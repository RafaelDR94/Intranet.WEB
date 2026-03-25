import { describe, it, expect, vi } from 'vitest'

import type { BillingAllDocumentsByRequisitionState, Get, Set } from '../types'

import { fetchBillingAllDocumentByIdRequisition } from './fetchBillingAllDocumentByIdRequisition'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => async () => ({
    data: { data: { billingdocument_id: '1', requisition: { billingrequisition_id: 'req-1' } } },
  }),
}))
vi.mock('@/app/mappings/billingalldocuments/billingalldocuments.mapper', () => ({
  BillingAllDocumentsByRequisitionMap: (d: unknown) => ({ ...(d as object), mapped: true }),
}))

describe('fetchBillingAllDocumentByIdRequisition util', () => {
  it('deberia poblar documento y limpiar loading', async () => {
    const state: Partial<BillingAllDocumentsByRequisitionState> = {
      billingDocumentByRequisition: null,
      loading: false,
      successGet: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingAllDocumentsByRequisitionState)
          : partial,
      )
    const get: Get = () => state as BillingAllDocumentsByRequisitionState

    await fetchBillingAllDocumentByIdRequisition('req-1', set, get)

    expect(state.billingDocumentByRequisition).toMatchObject({ billingdocument_id: '1' })
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
  })
})
