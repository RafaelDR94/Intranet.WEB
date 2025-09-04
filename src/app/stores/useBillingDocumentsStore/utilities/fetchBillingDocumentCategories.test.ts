import { describe, it, expect, vi } from 'vitest'
import { fetchBillingDocumentCategories } from './fetchBillingDocumentCategories'
import type { BillingDocumentsState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ id: '1', name: 'cat' }] } }) }))
vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({ BillingDocumentCategoryMap: (d: unknown) => d }))

describe('fetchBillingDocumentCategories util', () => {
  it('llena billingCategories y apaga gettingCategories', async () => {
    const state: Partial<BillingDocumentsState> = { billingCategories: [], gettingCategories: false, succesCategories: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    await fetchBillingDocumentCategories(set, get)

    expect(state.billingCategories).toHaveLength(1)
    expect(state.gettingCategories).toBe(false)
    expect(state.succesCategories).toBe(true)
  })
})
