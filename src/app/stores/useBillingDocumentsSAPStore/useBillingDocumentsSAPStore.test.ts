import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { Set } from './types'

vi.mock('./utilities', () => ({
  fetchBillingDocumentsSAP: vi.fn(async (set: Set) =>
    set({ billingDocumentsValid: [{ billingdocument_id: '1' } as any], loading: false, successGet: true }),
  ),
}))

import { useBillingDocumentsSAPStore } from './useBillingDocumentsSAPStore'

describe('useBillingDocumentsSAPStore', () => {
  beforeEach(() => {
    useBillingDocumentsSAPStore.setState({
      billingDocumentsValid: [],
      billingDocumentsNotValid: [],
      billingDocumentsBadCode: [],
      billingDocumentsEfos: [],
      loading: false,
      successGet: false,
      error: undefined,
      fetchBillingDocumentsSAP: useBillingDocumentsSAPStore.getState().fetchBillingDocumentsSAP,
      reset: useBillingDocumentsSAPStore.getState().reset,
      resetFlags: useBillingDocumentsSAPStore.getState().resetFlags,
    })
  })

  it('starts empty', () => {
    expect(useBillingDocumentsSAPStore.getState().billingDocumentsValid).toEqual([])
  })

  it('fetchBillingDocumentsSAP fills data', async () => {
    await useBillingDocumentsSAPStore.getState().fetchBillingDocumentsSAP()
    expect(useBillingDocumentsSAPStore.getState().billingDocumentsValid).toHaveLength(1)
    expect(useBillingDocumentsSAPStore.getState().successGet).toBe(true)
  })
})
