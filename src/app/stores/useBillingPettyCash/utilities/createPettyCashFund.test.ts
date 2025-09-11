import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set, Get } from '../types'

import { createPettyCashFund } from './createPettyCashFund'

vi.mock('./fetchPettyCashFunds', () => ({ fetchPettyCashFunds: vi.fn() }))
vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PettyCashFundMap: (d: unknown) => d, PostPettyCashFundMap: (d: unknown) => d }))

describe('createPettyCashFund', () => {
  it('crea fondo', async () => {
    const state: Partial<BillingPettyCashState> = { creating: false, successPostFund: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)
    const get: Get = () => state as BillingPettyCashState

    const res = await createPettyCashFund(set, get, { year_month: '2025-01', assigned_amount: 0, verified_amount: 0, cash_on_hand: 0, unverified_amount: 0, pending_verification: 0, available_amount: 0 })
    expect(res).toEqual({ id: '1' })
    expect(state.creating).toBe(false)
    expect(state.successPostFund).toBe(true)
  })
})

