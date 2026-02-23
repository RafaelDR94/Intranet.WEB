'use client'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingImagesByEmployeeState } from './types'
import { fetchBillingImagesByIdEmployee } from './utilities'

/**
 * Store global para la gestiÃ³n de imÃ¡genes de facturas por empleado.
 */
export const useBillingImagesByEmployeeStore = createWithEqualityFn<BillingImagesByEmployeeState>()(
  devtools((set, get) => ({
    billingImagesByEmployee: [],
    loading: false,
    successGet: false,
    error: undefined,

    fetchBillingImagesByEmployee: (idEmployee, force = false) =>
      fetchBillingImagesByIdEmployee(idEmployee, set, get, force),

    reset: () =>
      set({
        billingImagesByEmployee: [],
        loading: false,
        successGet: false,
        error: undefined,
      }),
    resetFlags: () =>
      set({
        loading: false,
        successGet: false,
        error: undefined,
      }),
  }))
)
