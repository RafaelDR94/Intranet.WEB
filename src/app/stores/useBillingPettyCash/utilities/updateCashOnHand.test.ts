import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set } from '../types'

import { updateCashOnHand } from './updateCashOnHand'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({}) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PutCashOnHandMap: (d: unknown) => d }))

describe('updateCashOnHand', () => {
  it('actualiza efectivo', async () => {
    const state: Partial<BillingPettyCashState> = { updating: false, successCashOnHand: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)

    const res = await updateCashOnHand(set, { id_petty_cash_found: '1', cash_on_hand: 0 })
    expect(res).toBe(true)
    expect(state.updating).toBe(false)
    expect(state.successCashOnHand).toBe(true)
  })
})

