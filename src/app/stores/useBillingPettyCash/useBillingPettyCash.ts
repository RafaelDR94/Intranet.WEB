'use client'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingPettyCashState } from './types'
import {
  fetchPettyCashFunds,
  fetchPettyCashFundById,
  createPettyCashFund,
  updatePettyCashFund,
  deletePettyCashFund,
  updateCashOnHand,
  fetchPettyCashVouchers,
  fetchPettyCashVoucherById,
  createPettyCashVoucher,
  updatePettyCashVoucher,
  deletePettyCashVoucher,
  rejectPettyCashVoucher,
  validatePettyCashVoucher,
} from './utilities'
// 👉 Nueva utilidad para historial por empleado
import { fetchPettyCashVouchersByIdEmployee } from './utilities/fetchPettyCashVouchersByIdEmployee'

/**
 * Store global para la gestión de caja chica.
 */
export const useBillingPettyCash = createWithEqualityFn<BillingPettyCashState>()(
  devtools((set, get) => ({
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
    successValidateVoucher: false,
    error: undefined,
    warning: undefined,

    fetchPettyCashFunds: (force = false) => fetchPettyCashFunds(set, get, force),
    fetchPettyCashFundById: (id, force = false) => fetchPettyCashFundById(id, set, get, force),
    createPettyCashFund: (payload) => createPettyCashFund(set, get, payload),
    updatePettyCashFund: (payload) => updatePettyCashFund(set, get, payload),
    deletePettyCashFund: (id) => deletePettyCashFund(set, id),
    updateCashOnHand: (payload) => updateCashOnHand(set, payload),
    fetchPettyCashVouchers: (force = false) => fetchPettyCashVouchers(set, get, force),
    fetchPettyCashVoucherById: (id, force = false) => fetchPettyCashVoucherById(id, set, get, force),
    createPettyCashVoucher: (payload) => createPettyCashVoucher(set, get, payload),
    updatePettyCashVoucher: (payload) => updatePettyCashVoucher(set, payload),
    deletePettyCashVoucher: (id) => deletePettyCashVoucher(set, id),
    rejectPettyCashVoucher: (id, comments) => rejectPettyCashVoucher(set, id, comments),
    validatePettyCashVoucher: (id) => validatePettyCashVoucher(set, id),

    // ✅ Nueva acción: historial de vales por empleado
    fetchPettyCashVouchersByIdEmployee: (idEmployee: string) =>
      fetchPettyCashVouchersByIdEmployee(set, get, idEmployee),

    reset: () =>
      set({
        pettyCashFunds: [],
        pettyCashVouchers: [],
        vouchersFull: [],
        pettyCashFund: undefined,
        pettyCashVoucher: undefined,
        pettyCashVoucherFull: undefined,
        error: undefined,
        warning: undefined,
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
        successValidateVoucher: false,
        loading: false,
        creating: false,
        updating: false,
        removing: false,
        validating: false,
        rejecting: false,
      }),
    resetFlags: () =>
      set({
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
        successValidateVoucher: false,
        error: undefined,
        warning: undefined,
      }),
  }))
)
