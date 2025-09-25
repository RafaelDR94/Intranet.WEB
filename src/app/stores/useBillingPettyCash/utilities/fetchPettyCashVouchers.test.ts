import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set, Get } from '../types'

import { fetchPettyCashVouchers } from './fetchPettyCashVouchers'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ id: '1' }] } }) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PettyCashVouchersMap: (d: unknown[]) => d }))

describe('fetchPettyCashVouchers', () => {
  it('llena vales', async () => {
    const state: Partial<BillingPettyCashState> = { pettyCashVouchers: [], loading: false, successGetVouchers: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)
    const get: Get = () => state as BillingPettyCashState

    await fetchPettyCashVouchers(set, get)

    expect(state.pettyCashVouchers).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGetVouchers).toBe(true)
  })
})

