'use client'

import { devtools } from 'zustand/middleware'
import { createWithEqualityFn } from 'zustand/traditional'

import type { BillingCompleteProcessToSAPState } from './types'
import { completeProcessToSAP } from './utilities'

const initialState: Pick<
  BillingCompleteProcessToSAPState,
  'sending' | 'success' | 'error' | 'response'
> = {
  sending: false,
  success: false,
  error: undefined,
  response: null,
}

export const useBillingCompleteProcessToSAPStore =
  createWithEqualityFn<BillingCompleteProcessToSAPState>()(
    devtools((set, get) => ({
      ...initialState,
      completeProcessToSAP: (ids) => completeProcessToSAP(set, get, ids),
      reset: () => set({ ...initialState }),
      resetFlags: () => set({ sending: false, success: false, error: undefined }),
    })),
  )
