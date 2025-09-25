import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set } from '../types'

import { deletePettyCashFund } from './deletePettyCashFund'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pDelete: () => async () => ({}) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ DeletePettyCashFundMap: (d: unknown) => d }))

describe('deletePettyCashFund', () => {
  it('elimina fondo', async () => {
    const state: Partial<BillingPettyCashState> = { removing: false, successDeleteFund: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)

    const res = await deletePettyCashFund(set, '1')
    expect(res).toBe(true)
    expect(state.removing).toBe(false)
    expect(state.successDeleteFund).toBe(true)
  })
})

