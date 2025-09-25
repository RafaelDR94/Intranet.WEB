import { describe, it, expect, vi } from 'vitest'

import type { BillingPettyCashState, Set } from '../types'

import { validatePettyCashVoucher } from './validatePettyCashVoucher'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({}) }))
vi.mock('@/app/mappings/billingPettyCash/billingPettyCash.mapper', () => ({ PutPettyCashValidateIdMap: (d: unknown) => d }))

describe('validatePettyCashVoucher', () => {
  it('valida vale', async () => {
    const state: Partial<BillingPettyCashState> = { validating: false, successValidateVoucher: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingPettyCashState) : partial)

    const res = await validatePettyCashVoucher(set, '1')
    expect(res).toBe(true)
    expect(state.validating).toBe(false)
    expect(state.successValidateVoucher).toBe(true)
  })
})

