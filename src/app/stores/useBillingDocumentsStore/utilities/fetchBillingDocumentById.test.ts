import { describe, it, expect, vi } from 'vitest'

import type { BillingDocumentsState, Set, Get } from '../types'

import { fetchBillingDocumentById } from './fetchBillingDocumentById'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: { billingdocument_id: '1' } } }) }))

describe('fetchBillingDocumentById util', () => {
  it('llena billingDocument y apaga loading', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocument: undefined, loading: false, successGetById: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const res = await fetchBillingDocumentById('1', set, get)

    expect(res?.billingdocument_id).toBe('1')
    expect(state.loading).toBe(false)
    expect(state.successGetById).toBe(true)
  })
})
