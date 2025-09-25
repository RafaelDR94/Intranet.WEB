import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set, Get } from '../types'

import { fetchPettyCashFundById } from './fetchPettyCashFundById'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PettyCashFundMap: (d: unknown) => d }))

describe('fetchPettyCashFundById', () => {
  it('obtiene fondo por id', async () => {
    const state: Partial<BillingPettyCashState> = { loading: false, successGetFund: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)
    const get: Get = () => state as BillingPettyCashState

    const res = await fetchPettyCashFundById('1', set, get)
    expect(res).toEqual({ id: '1' })
    expect(state.loading).toBe(false)
    expect(state.successGetFund).toBe(true)
  })
})

