import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { PettyCashFundData } from '@/app/mappings/billingPettyCash/BillingPettyCash.types'
import type { Set } from './types'

vi.mock('./utilities', () => ({
  fetchPettyCashFunds: vi.fn(async (set: Set) => set({ pettyCashFunds: [{ id: '1' } as PettyCashFundData], loading: false })),
  createPettyCashFund: vi.fn(async (set: Set) => { set({ successPostFund: true }); return { id: '2' } as PettyCashFundData })
}))

import { useBillingPettyCash } from './useBillingPettyCash'

describe('useBillingPettyCash', () => {
  beforeEach(() => {
    useBillingPettyCash.setState({
      pettyCashFunds: [],
      pettyCashVouchers: [],
      vouchersFull: [],
      pettyCashFund: undefined,
      pettyCashVoucher: undefined,
      pettyCashVoucherFull: undefined,
      loading: false,
      creating: false,
      updating: false,
      removing: false,
      validating: false,
      rejecting: false,
      successGetFunds: false,
      successGetFund: false,
      successPostFund: false,
      successPutFund: false,
      successDeleteFund: false,
      successCashOnHand: false,
      successGetVouchers: false,
      successGetVoucher: false,
      successPostVoucher: false,
      successPutVoucher: false,
      successDeleteVoucher: false,
      successRejectVoucher: false,
      successRejectInvoice: false,
      successValidateVoucher: false,
      error: undefined,
      warning: undefined,
    })
  })

  it('inicia vacío', () => {
    expect(useBillingPettyCash.getState().pettyCashFunds).toEqual([])
  })

  it('fetchPettyCashFunds carga datos', async () => {
    await useBillingPettyCash.getState().fetchPettyCashFunds()
    expect(useBillingPettyCash.getState().pettyCashFunds).toHaveLength(1)
  })
})

