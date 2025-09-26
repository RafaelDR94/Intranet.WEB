import { describe, it, expect, vi } from 'vitest'

import type { BillingHistoryState, Set, Get } from '../types'

import { fetchBillingHistory } from './fetchBillingHistory'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ id: '1' }] } }) }))
vi.mock('@/app/mappings/billinghistory/billinghistory.mapper', () => ({ BillingHistoryMap: (d: unknown[]) => d }))

describe('fetchBillingHistory util', () => {
  it('debería poblar historial y limpiar loading', async () => {
    const state: Partial<BillingHistoryState> = { history: [], loading: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingHistoryState) : partial)
    const get: Get = () => state as BillingHistoryState

    await fetchBillingHistory(set, get)

    expect(state.history).toHaveLength(1)
    expect(state.loading).toBe(false)
  })
})
