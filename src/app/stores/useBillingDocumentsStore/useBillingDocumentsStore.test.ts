import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { BillingDocument } from '@/app/mappings/billingdocuments/billingdocuments.types'
import type { Set } from './types'

vi.mock('./utilities', () => ({
  fetchBillingDocuments: vi.fn(async (set: Set) => set({ billingDocuments: [{ billing_document_id: '1' } as any], loading: false })),
  fetchBillingDocumentById: vi.fn(async (id: string, set: Set) => { set({ billingDocument: { billing_document_id: id } as any, loading: false }); return { billing_document_id: id } as BillingDocument }),
  createBillingDocument: vi.fn(async (set: Set) => { set({ successPost: true }); return { billing_document_id: '2' } as BillingDocument }),
  updateBillingDocument: vi.fn(async (set: Set) => { set({ successPut: true }); return null }),
  deleteBillingDocument: vi.fn(async (set: Set) => { set({ successDelete: true }); return true }),
}))

import { useBillingDocumentsStore } from './useBillingDocumentsStore'

describe('useBillingDocumentsStore', () => {
  beforeEach(() => {
    useBillingDocumentsStore.setState({
      billingDocuments: [],
      billingDocument: undefined,
      loading: false,
      creating: false,
      updating: false,
      removing: false,
      successGet: false,
      successGetById: false,
      successPost: false,
      successPut: false,
      successDelete: false,
      error: undefined,
      warning: undefined,
    })
  })

  it('inicia vacío', () => {
    expect(useBillingDocumentsStore.getState().billingDocuments).toEqual([])
  })

  it('fetchBillingDocuments carga datos', async () => {
    await useBillingDocumentsStore.getState().fetchBillingDocuments()
    expect(useBillingDocumentsStore.getState().billingDocuments).toHaveLength(1)
  })
})
