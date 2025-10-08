import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set } from '../types'

import { updatePettyCashVoucherAmount } from './updatePettyCashVoucherAmount'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pPut: () => async () => ({ data: { success: true } }),
}))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({
  PutPettyCashVoucherHistoryAmountMap: (payload: unknown) => payload,
}))

describe('updatePettyCashVoucherAmount', () => {
  it('actualiza el monto e informa éxito', async () => {
    const state: Partial<BillingPettyCashState> = {
      updating: false,
      successPutVoucherAmount: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingPettyCashState)
          : partial,
      )

    const result = await updatePettyCashVoucherAmount(set, {
      id: 'voucher-1',
      date: '2024-03-01T00:00:00.000Z',
      amount: 2500,
    })

    expect(result).toBe(true)
    expect(state.updating).toBe(false)
    expect(state.successPutVoucherAmount).toBe(true)
  })
})

