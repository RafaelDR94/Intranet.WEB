import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set, Get } from '../types'

import { createPettyCashVoucher } from './createPettyCashVoucher'

vi.mock('./fetchPettyCashVouchers', () => ({ fetchPettyCashVouchers: vi.fn() }))
vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PettyCashVoucherMap: (d: unknown) => d, PostPettyCashVoucherMap: (d: unknown) => d }))

describe('createPettyCashVoucher', () => {
  it('crea vale', async () => {
    const state: Partial<BillingPettyCashState> = { creating: false, successPostVoucher: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)
    const get: Get = () => state as BillingPettyCashState

    const res = await createPettyCashVoucher(set, get, { petty_cash_funds_id: '1', employee_id: '1', voucher_type: 't', application_date: 'd', concept: 'c', amount: '0', comments: '', project_id: 'p', xml: '', pdf: '', authorization_evidence: '' })
    expect(res).toEqual({ id: '1' })
    expect(state.creating).toBe(false)
    expect(state.successPostVoucher).toBe(true)
  })
})

