import { describe, it, expect, vi } from 'vitest'
import { fetchBillingImageById } from './fetchBillingImageById'
import type { BillingImagesState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: { billing_image_id: '1' } } }) }))

describe('fetchBillingImageById util', () => {
  it('guarda billingImage y marca successGetById', async () => {
    const state: Partial<BillingImagesState> = { billingImage: undefined, loading: false, successGetById: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingImagesState) : partial)
    const get: Get = () => state as BillingImagesState

    const res = await fetchBillingImageById('1', set, get)

    expect(res?.billing_image_id).toBe('1')
    expect(state.billingImage?.billing_image_id).toBe('1')
    expect(state.successGetById).toBe(true)
  })
})
