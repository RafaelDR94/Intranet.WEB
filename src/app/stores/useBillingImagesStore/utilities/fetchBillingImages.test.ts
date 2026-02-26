import { describe, it, expect, vi } from 'vitest'

import type { BillingImagesState, Set, Get } from '../types'

import { fetchBillingImages } from './fetchBillingImages'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ billing_image_id: '1' }] } }) }))

describe('fetchBillingImages util', () => {
  it('llena billingImages y apaga loading', async () => {
    const state: Partial<BillingImagesState> = { billingImages: [], loading: false, successGet: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingImagesState) : partial)
    const get: Get = () => state as BillingImagesState

    await fetchBillingImages(set, get, 'emp-1')

    expect(state.billingImages).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
  })
})
