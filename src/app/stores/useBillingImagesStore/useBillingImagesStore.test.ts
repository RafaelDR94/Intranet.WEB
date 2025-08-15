import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { BillingImages } from '@/app/mappings/billingimages/billingimages.types'
import type { Set } from './types'

vi.mock('./utilities', () => ({
  fetchBillingImages: vi.fn(async (set: Set) => set({ billingImages: [{ billing_image_id: '1' } as any], loading: false })),
  fetchBillingImageById: vi.fn(async (id: string, set: Set) => { set({ billingImage: { billing_image_id: id } as any, loading: false }); return { billing_image_id: id } as BillingImages }),
  createBillingImage: vi.fn(async (set: Set) => { set({ successPost: true }); return { billing_image_id: '2' } as BillingImages }),
  updateBillingImage: vi.fn(async (set: Set) => { set({ successPut: true }); return null }),
  deleteBillingImage: vi.fn(async (set: Set) => { set({ successDelete: true }); return true }),
}))

import { useBillingImagesStore } from './useBillingImagesStore'

describe('useBillingImagesStore', () => {
  beforeEach(() => {
    useBillingImagesStore.setState({
      billingImages: [],
      billingImage: undefined,
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
    expect(useBillingImagesStore.getState().billingImages).toEqual([])
  })

  it('fetchBillingImages carga datos', async () => {
    await useBillingImagesStore.getState().fetchBillingImages()
    expect(useBillingImagesStore.getState().billingImages).toHaveLength(1)
  })
})
