import { describe, it, expect, vi } from 'vitest'

import type { BillingDocumentsState, Set, Get } from '../types'

import { fetchExpenseTypeCatalog } from './fetchExpenseTypeCatalog'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ id: '1', satKey: '78111804' }] } }) }))
vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({ ExpenseTypeCatalogMap: (d: unknown) => d }))

describe('fetchExpenseTypeCatalog util', () => {
  it('llena expenseTypeCatalog y apaga gettingExpenseTypeCatalog', async () => {
    const state: Partial<BillingDocumentsState> = { expenseTypeCatalog: [], gettingExpenseTypeCatalog: false, successExpenseTypeCatalog: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    await fetchExpenseTypeCatalog(set, get)

    expect(state.expenseTypeCatalog).toHaveLength(1)
    expect(state.gettingExpenseTypeCatalog).toBe(false)
    expect(state.successExpenseTypeCatalog).toBe(true)
  })
})
