'use client'
import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingAllDocumentsByRequisitionState } from './types'
import { fetchBillingAllDocumentByIdRequisition } from './utilities'

/**
 * Store global para la gestión de documentos completos por requisición.
 */
export const useBillingAllDocumentsByRequisitionStore = createWithEqualityFn<BillingAllDocumentsByRequisitionState>()(
  devtools((set, get) => ({
    billingDocumentByRequisition: null,
    loading: false,
    successGet: false,
    error: undefined,

    fetchBillingAllDocumentByRequisition: (idRequisition, force = false) =>
      fetchBillingAllDocumentByIdRequisition(idRequisition, set, get, force),

    reset: () =>
      set({
        billingDocumentByRequisition: null,
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
  })),
)
