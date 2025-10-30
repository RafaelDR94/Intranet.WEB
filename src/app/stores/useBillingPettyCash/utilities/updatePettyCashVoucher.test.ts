import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set } from '../types'

import { updatePettyCashVoucher } from './updatePettyCashVoucher'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PettyCashVoucherMap: (d: unknown) => d, PutPettyCashVoucherMap: (d: unknown) => d }))

describe('updatePettyCashVoucher', () => {
  it('actualiza vale', async () => {
    const state: Partial<BillingPettyCashState> = { updating: false, successPutVoucher: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)

    const res = await updatePettyCashVoucher(set, { id: '1', petty_cash_funds_id: '1', employee_id: '1', voucher_type: 't', application_date: 'd', concept: 'c', amount: 0, comments: '', project_id: 'p', xml: '', pdf: '' })
    expect(res).toEqual({ id: '1' })
    expect(state.updating).toBe(false)
    expect(state.successPutVoucher).toBe(true)
  })
})

