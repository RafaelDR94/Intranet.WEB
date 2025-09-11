import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set, Get } from '../types'

import { fetchPettyCashFunds } from './fetchPettyCashFunds'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ id: '1' }] } }) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PettyCashFundsMap: (d: unknown[]) => d }))

describe('fetchPettyCashFunds', () => {
  it('llena fondos y apaga loading', async () => {
    const state: Partial<BillingPettyCashState> = { pettyCashFunds: [], loading: false, successGetFunds: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)
    const get: Get = () => state as BillingPettyCashState

    await fetchPettyCashFunds(set, get)

    expect(state.pettyCashFunds).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGetFunds).toBe(true)
  })
})

