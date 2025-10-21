'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingDocumentsSAPState } from './types'
import { fetchBillingDocumentsSAP } from './utilities'

const initialState: Pick<
  BillingDocumentsSAPState,
  | 'billingDocumentsValid'
  | 'billingDocumentsNotValid'
  | 'billingDocumentsBadCode'
  | 'billingDocumentsEfos'
  | 'loading'
  | 'successGet'
  | 'error'
> = {
  billingDocumentsValid: [],
  billingDocumentsNotValid: [],
  billingDocumentsBadCode: [],
  billingDocumentsEfos: [],
  loading: false,
  successGet: false,
  error: undefined,
}

export const useBillingDocumentsSAPStore =
  createWithEqualityFn<BillingDocumentsSAPState>()(
    devtools((set, get) => ({
      ...initialState,
      fetchBillingDocumentsSAP: (force = false) =>
        fetchBillingDocumentsSAP(set, get, force),
      reset: () => set({ ...initialState }),
      resetFlags: () => set({ loading: false, successGet: false, error: undefined }),
    })),
  )
