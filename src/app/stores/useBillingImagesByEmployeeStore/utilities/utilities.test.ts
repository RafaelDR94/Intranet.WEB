import { describe, it, expect, vi } from 'vitest'

import type { BillingImagesByEmployeeState, Set, Get } from '../types'

import { fetchBillingImagesByIdEmployee } from './fetchBillingImagesByIdEmployee'

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => vi.fn(),
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => async () => ({
    data: {
      data: [
        {
          billing_image_id: 'img-1',
          employee: { employee_id: 'emp-1', fullname: 'Demo User' },
          Category: { id: 'cat-1', name: 'HOSPEDAJE' },
          numpersons: '1',
          numnights: '2',
          status: 'PENDIENTE',
          images: [{ image: 'https://example.com/ticket.jpg' }],
          comments: null,
          date_created: '2026-02-20 11:01:43',
          user_comments: null,
        },
      ],
    },
  }),
}))

describe('fetchBillingImagesByIdEmployee util', () => {
  it('llena billingImagesByEmployee y apaga loading', async () => {
    const state: Partial<BillingImagesByEmployeeState> = {
      billingImagesByEmployee: [],
      loading: false,
      successGet: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingImagesByEmployeeState)
          : partial,
      )
    const get: Get = () => state as BillingImagesByEmployeeState

    await fetchBillingImagesByIdEmployee('emp-1', set, get)

    expect(state.billingImagesByEmployee).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
  })
})
