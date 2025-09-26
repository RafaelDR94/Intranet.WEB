import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set } from '../types'

import { deletePettyCashVoucher } from './deletePettyCashVoucher'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pDelete: () => async () => ({}) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ DeletePettyCashVoucherIdMap: (d: unknown) => d }))

describe('deletePettyCashVoucher', () => {
  it('elimina vale', async () => {
    const state: Partial<BillingPettyCashState> = { removing: false, successDeleteVoucher: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)

    const res = await deletePettyCashVoucher(set, '1')
    expect(res).toBe(true)
    expect(state.removing).toBe(false)
    expect(state.successDeleteVoucher).toBe(true)
  })
})

