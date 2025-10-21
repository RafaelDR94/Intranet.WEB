'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingDocumentsSAPState } from './types'
import { fetchBillingDocumentsSAP } from './utilities'

/**
 * Estado inicial simplificado: solo una lista de billingDocuments
 */
const initialState: Pick<
  BillingDocumentsSAPState,
  'billingDocuments' | 'loading' | 'successGet' | 'error'
> = {
  billingDocuments: [],
  loading: false,
  successGet: false,
  error: undefined,
}

/**
 * Store de documentos SAP
 */
export const useBillingDocumentsSAPStore =
  createWithEqualityFn<BillingDocumentsSAPState>()(
    devtools((set, get) => ({
      ...initialState,

      /**
       * Acción para obtener los documentos SAP
       */
      fetchBillingDocumentsSAP: (force = false) =>
        fetchBillingDocumentsSAP(set, get, force),

      /**
       * Reinicia todo el estado
       */
      reset: () => set({ ...initialState }),

      /**
       * Reinicia solo las banderas de estado (loading, error, success)
       */
      resetFlags: () => set({ loading: false, successGet: false, error: undefined }),
    })),
  )
