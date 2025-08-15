import { describe, it, expect, vi } from 'vitest'
import { updateBillingImage } from './updateBillingImage'
import type { BillingImagesState, Set, Get } from '../types'
import type { BillingPut } from '@/app/mappings/billingimages/billingimages.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({ data: { data: { billing_image_id: '3' } } }) }))
vi.mock('./fetchBillingImages', () => ({ fetchBillingImages: vi.fn(async () => {}) }))

describe('updateBillingImage util', () => {
  it('marca successPut y limpia updating', async () => {
    const state: Partial<BillingImagesState> = { updating: false, successPut: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingImagesState) : partial)
    const get: Get = () => state as BillingImagesState

    const payload: BillingPut = { billing_image_id: '3', requisition_id: 'a', status_id: 'b', Image: 'img', downloaded: false }
    const res = await updateBillingImage(set, get, payload)

    expect(res?.billing_image_id).toBe('3')
    expect(state.updating).toBe(false)
    expect(state.successPut).toBe(true)
  })
})
