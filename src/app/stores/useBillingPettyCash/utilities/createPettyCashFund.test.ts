import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set, Get } from '../types'

import { createPettyCashFund } from './createPettyCashFund'

const fetchPettyCashFundsMock = vi.hoisted(() => vi.fn())
const fetchPettyCashFundByIdMock = vi.hoisted(() => vi.fn())

vi.mock('./fetchPettyCashFunds', () => ({ fetchPettyCashFunds: fetchPettyCashFundsMock }))
vi.mock('./fetchPettyCashFundById', () => ({
  fetchPettyCashFundById: fetchPettyCashFundByIdMock,
}))
vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PettyCashFundMap: (d: unknown) => d, PostPettyCashFundMap: (d: unknown) => d }))

describe('createPettyCashFund', () => {
  it('crea fondo', async () => {
    fetchPettyCashFundsMock.mockReset()
    fetchPettyCashFundByIdMock.mockReset()

    const state: Partial<BillingPettyCashState> = { creating: false, successPostFund: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)
    const get: Get = () => state as BillingPettyCashState

    fetchPettyCashFundByIdMock.mockImplementationOnce(async (_id: string, innerSet: Set) => {
      innerSet({ pettyCashFund: { id: '1', assigned_amount: 99 } } as Partial<BillingPettyCashState>)
      return { id: '1', assigned_amount: 99 }
    })

    const res = await createPettyCashFund(set, get, { year_month: '2025-01', assigned_amount: 0, verified_amount: 0, cash_on_hand: 0, unverified_amount: 0, pending_verification: 0, available_amount: 0 })
    expect(res).toEqual({ id: '1' })
    expect(state.creating).toBe(false)
    expect(state.successPostFund).toBe(true)
    expect(state.pettyCashFund).toEqual({ id: '1', assigned_amount: 99 })
    expect(fetchPettyCashFundByIdMock).toHaveBeenCalledWith('1', expect.any(Function), expect.any(Function), true)
    expect(fetchPettyCashFundsMock).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), true)
  })
})

