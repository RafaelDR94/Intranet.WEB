import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set, Get } from '../types'

import { updatePettyCashFund } from './updatePettyCashFund'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PettyCashFundMap: (d: unknown) => d, PutPettyCashFundMap: (d: unknown) => d }))

describe('updatePettyCashFund', () => {
  it('actualiza fondo', async () => {
    const state: Partial<BillingPettyCashState> = { updating: false, successPutFund: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)
    const get: Get = () => state as BillingPettyCashState

    const res = await updatePettyCashFund(set, get, { id: '1', year_month: '2025-01', assigned_amount: 0, verified_amount: 0, cash_on_hand: 0, unverified_amount: 0, pending_verification: 0, available_amount: 0 })
    expect(res).toEqual({ id: '1' })
    expect(state.updating).toBe(false)
    expect(state.successPutFund).toBe(true)
  })
})

