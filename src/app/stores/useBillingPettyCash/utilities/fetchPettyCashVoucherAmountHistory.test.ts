import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Get, Set } from '../types'

import { fetchPettyCashVoucherAmountHistory } from './fetchPettyCashVoucherAmountHistory'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () =>
    async () => ({
      data: {
        data: [
          { date: '2024-01-10', amount: 1200 },
          { date: '2024-02-05', amount: 1500 },
        ],
      },
    }),
}))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({
  PettyCashVoucherHistoryAmountMap: (list: unknown) => list,
}))

describe('fetchPettyCashVoucherAmountHistory', () => {
  it('carga el historial y marca la bandera de éxito', async () => {
    const state: Partial<BillingPettyCashState> = {
      pettyCashVoucherAmountHistory: [],
      pettyCashVoucherAmountHistoryId: undefined,
      loadingAmountHistory: false,
      successGetVoucherAmountHistory: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingPettyCashState)
          : partial,
      )
    const get: Get = () => state as BillingPettyCashState

    const history = await fetchPettyCashVoucherAmountHistory('voucher-1', set, get)

    expect(history).toHaveLength(2)
    expect(state.pettyCashVoucherAmountHistoryId).toBe('voucher-1')
    expect(state.loadingAmountHistory).toBe(false)
    expect(state.successGetVoucherAmountHistory).toBe(true)
  })
})

