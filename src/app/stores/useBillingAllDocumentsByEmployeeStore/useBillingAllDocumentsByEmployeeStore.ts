'use client'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingAllDocumentsByEmployeeState } from './types'
import { fetchBillingAllDocumentsByIdEmployee } from './utilities'

/**
 * Store global para la gestion de documentos de facturacion por empleado.
 */
export const useBillingAllDocumentsByEmployeeStore = createWithEqualityFn<BillingAllDocumentsByEmployeeState>()(
  devtools((set, get) => ({
    billingDocumentsByEmployee: [],
    loading: false,
    successGet: false,
    error: undefined,

    fetchBillingAllDocumentsByEmployee: (idEmployee, force = false) =>
      fetchBillingAllDocumentsByIdEmployee(idEmployee, set, get, force),

    reset: () =>
      set({
        billingDocumentsByEmployee: [],
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
