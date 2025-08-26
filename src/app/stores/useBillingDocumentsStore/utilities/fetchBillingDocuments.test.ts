import { describe, it, expect, vi } from 'vitest'
import { fetchBillingDocuments } from './fetchBillingDocuments'
import type { BillingDocumentsState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => async () => ({
    data: { data: { today: [{ billingdocument_id: '1' }], notToday: [] } },
  }),
}))

describe('fetchBillingDocuments util', () => {
  it('llena billingDocuments y apaga loading', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocuments: [], loading: false, successGet: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    await fetchBillingDocuments(set, get)

    expect(state.billingDocuments).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
  })
})
