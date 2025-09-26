import { describe, it, expect, vi } from 'vitest'

import type { BillingDocumentsState, Set, Get } from '../types'

import { fetchSatBillingDocument } from './fetchSatBillingDocument'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: { validas: [{ id: '1' }], noValidas: [], prohibidas: [], efos: [] } } }) }))
vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({ BillingDocumentsMap: (d: unknown[]) => d }))

describe('fetchSatBillingDocument util', () => {
  it('llena billingDocumentsValid y apaga loadigSat', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocumentsValid: [], loadigSat: false, successGetSat: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    await fetchSatBillingDocument(set, get)

    expect(state.billingDocumentsValid).toHaveLength(1)
    expect(state.loadigSat).toBe(false)
    expect(state.successGetSat).toBe(true)
  })
})
