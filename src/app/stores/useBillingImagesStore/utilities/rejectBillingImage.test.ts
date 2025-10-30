import { describe, it, expect, vi } from 'vitest'

import type { BillingImagesState, Set, Get } from '../types'

import { rejectBillingImage } from './rejectBillingImage'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({ data: { data: { billing_image_id: '1' } } }) }))
vi.mock('./fetchBillingImages', () => ({ fetchBillingImages: vi.fn() }))

describe('rejectBillingImage util', () => {
  it('marca succesReject y limpia rejecting', async () => {
    const state: Partial<BillingImagesState> = { rejecting: false, succesReject: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingImagesState) : partial)
    const get: Get = () => state as BillingImagesState

    const res = await rejectBillingImage(set, get, { billing_image_id: '1', comments: 'c' })
    expect(res?.billing_image_id).toBe('1')
    expect(state.rejecting).toBe(false)
    expect(state.succesReject).toBe(true)
  })
})
