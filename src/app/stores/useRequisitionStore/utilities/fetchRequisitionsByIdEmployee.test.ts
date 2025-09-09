import { describe, it, expect, vi } from 'vitest'

import type { RequisitionsState, Set, Get } from '../types'

import { fetchRequisitionsByIdEmployee } from './fetchRequisitionsByIdEmployee'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ billingrequisition_id: '1' }] } }) }))
vi.mock('@/app/mappings/requisitions/requisitions.mapp', () => ({ RequisitionsMap: (d: unknown[]) => d }))

describe('fetchRequisitionsByIdEmployee util', () => {
  it('llena requisitions', async () => {
    const state: Partial<RequisitionsState> = { requisitions: [], loading: false, successGet: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as RequisitionsState) : partial)
    const get: Get = () => state as RequisitionsState

    await fetchRequisitionsByIdEmployee('emp1', set, get)

    expect(state.requisitions).toHaveLength(1)
    expect(state.successGet).toBe(true)
  })
})
