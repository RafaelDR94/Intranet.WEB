import { describe, it, expect, vi } from 'vitest'
import { fetchBillingDocumentDescriptions } from './fetchBillingDocumentDescriptions'
import type { BillingDocumentsState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ id: '1', name: 'desc' }] } }) }))
vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({ BillingDocumentDescriptionMap: (d: unknown) => d }))

describe('fetchBillingDocumentDescriptions util', () => {
  it('llena billingDocumentDescription y apaga gettingDescriptions', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocumentDescription: [], gettingDescriptions: false, succesDescriptions: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    await fetchBillingDocumentDescriptions('1', set, get)

    expect(state.billingDocumentDescription).toHaveLength(1)
    expect(state.gettingDescriptions).toBe(false)
    expect(state.succesDescriptions).toBe(true)
  })
})
