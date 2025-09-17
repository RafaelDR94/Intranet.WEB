import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set, Get } from '../types'

import { fetchPettyCashVoucherById } from './fetchPettyCashVoucherById'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({
  PettyCashVoucherMap: (d: any) => ({ ...d, light: true }),
  PettyCashVoucherFullMap: (d: any) => ({ ...d, full: true }),
}))

describe('fetchPettyCashVoucherById', () => {
  it('obtiene vale por id', async () => {
    const state: Partial<BillingPettyCashState> = { loading: false, successGetVoucher: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)
    const get: Get = () => state as BillingPettyCashState

    const res = await fetchPettyCashVoucherById('1', set, get)
    expect(res).toEqual({ id: '1', full: true })
    expect(state.loading).toBe(false)
    expect(state.successGetVoucher).toBe(true)
    expect(state.pettyCashVoucherFull).toEqual({ id: '1', full: true })
    expect(state.pettyCashVoucher).toEqual({ id: '1', light: true })
  })
})

