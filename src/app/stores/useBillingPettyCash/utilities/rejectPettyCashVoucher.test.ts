import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set } from '../types'

import { rejectPettyCashVoucher } from './rejectPettyCashVoucher'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({}) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PutPettyCashRejectIdMap: (d: unknown) => d }))

describe('rejectPettyCashVoucher', () => {
  it('rechaza vale', async () => {
    const state: Partial<BillingPettyCashState> = { rejecting: false, successRejectVoucher: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)

    const res = await rejectPettyCashVoucher(set, '1')
    expect(res).toBe(true)
    expect(state.rejecting).toBe(false)
    expect(state.successRejectVoucher).toBe(true)
  })
})

