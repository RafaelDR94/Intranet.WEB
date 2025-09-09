import { describe, it, expect, vi } from 'vitest'

import type { BillingImagesState, Set, Get } from '../types'

import { deleteBillingImage } from './deleteBillingImage'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pDelete: () => async () => ({}) }))

describe('deleteBillingImage util', () => {
  it('elimina imagen y marca successDelete', async () => {
    const state: Partial<BillingImagesState> = { billingImages: [{ billing_image_id: '1' } as any], removing: false, successDelete: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingImagesState) : partial)
    const get: Get = () => state as BillingImagesState

    const res = await deleteBillingImage(set, get, '1')

    expect(res).toBe(true)
    expect(state.billingImages).toHaveLength(0)
    expect(state.successDelete).toBe(true)
  })
})
