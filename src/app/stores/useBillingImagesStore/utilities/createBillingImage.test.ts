import { describe, it, expect, vi } from 'vitest'

import type { BillingImagesState, Set, Get } from '../types'

import { createBillingImage } from './createBillingImage'

import type { BillingPost } from '@/app/mappings/billingimages/billingimages.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { data: { billing_image_id: '2' } } }) }))
vi.mock('./fetchBillingImages', () => ({ fetchBillingImages: vi.fn(async () => {}) }))

describe('createBillingImage util', () => {
  it('marca successPost y limpia creating', async () => {
    const state: Partial<BillingImagesState> = { creating: false, successPost: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingImagesState) : partial)
    const get: Get = () => state as BillingImagesState

    const payload: BillingPost = {
      employee_id: 'emp-1',
      requisition_id: 'a',
      category_id: 'cat-1',
      images: [],
      description: '',
      numpersons: '0',
      numnights: '0',
    }
    const res = await createBillingImage(set, get, payload)

    expect(res?.billing_image_id).toBe('2')
    expect(state.creating).toBe(false)
    expect(state.successPost).toBe(true)
  })
})
