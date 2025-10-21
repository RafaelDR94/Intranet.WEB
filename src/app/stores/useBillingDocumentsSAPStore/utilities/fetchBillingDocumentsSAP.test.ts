import { describe, it, expect, vi } from 'vitest'

import type { BillingDocumentsSAPState, Set, Get } from '../types'

import { fetchBillingDocumentsSAP } from './fetchBillingDocumentsSAP'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => async () => ({ data: { data: { validas: [{ id: '1' }], noValidas: [], prohibidas: [], efos: [] } } }),
}))
vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({
  BillingDocumentFullMap: (data: unknown) => data,
}))

describe('fetchBillingDocumentsSAP util', () => {
  it('stores billing documents and stops loading', async () => {
    const state: Partial<BillingDocumentsSAPState> = {
      billingDocumentsValid: [],
      billingDocumentsNotValid: [],
      billingDocumentsBadCode: [],
      billingDocumentsEfos: [],
      loading: false,
      successGet: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingDocumentsSAPState)
          : partial,
      )
    const get: Get = () => state as BillingDocumentsSAPState

    await fetchBillingDocumentsSAP(set, get)

    expect(state.billingDocumentsValid).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
  })
})
