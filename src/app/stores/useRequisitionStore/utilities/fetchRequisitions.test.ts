import { describe, it, expect, vi } from 'vitest'
import { fetchRequisitions } from './fetchRequisitions'
import type { RequisitionsState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ id_billingrequisition: '1' }] } }) }))
vi.mock('@/app/mappings/requisitions/requisitions.mapp', () => ({ RequisitionsMap: (d: unknown[]) => d }))

describe('fetchRequisitions util', () => {
  it('llena requisitions y apaga loading', async () => {
    const state: Partial<RequisitionsState> = { requisitions: [], loading: false, successGet: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as RequisitionsState) : partial)
    const get: Get = () => state as RequisitionsState

    await fetchRequisitions(set, get)

    expect(state.requisitions).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
  })
})
