import { describe, it, expect, vi } from 'vitest'

import type { BillingAllDocumentsByEmployeeState, Set, Get } from '../types'

import { fetchBillingAllDocumentsByIdEmployee } from './fetchBillingAllDocumentsByIdEmployee'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => async () => ({ data: { data: [{ billingdocument_id: '1' }] } }),
}))
vi.mock('@/app/mappings/billingalldocuments/billingalldocuments.mapper', () => ({
  BillingAllDocumentsByEmployeeListMap: (d: unknown[]) => d,
}))

describe('fetchBillingAllDocumentsByIdEmployee util', () => {
  it('deberia poblar documentos y limpiar loading', async () => {
    const state: Partial<BillingAllDocumentsByEmployeeState> = {
      billingDocumentsByEmployee: [],
      loading: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingAllDocumentsByEmployeeState)
          : partial,
      )
    const get: Get = () => state as BillingAllDocumentsByEmployeeState

    await fetchBillingAllDocumentsByIdEmployee('emp-1', set, get)

    expect(state.billingDocumentsByEmployee).toHaveLength(1)
    expect(state.loading).toBe(false)
  })
})
