import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { RequisitionsState, Set, Get } from '../types'

import { fetchRequisitionsByIdEmployee } from './fetchRequisitionsByIdEmployee'

const getResponseMock = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => getResponseMock }))
vi.mock('@/app/mappings/requisitions/requisitions.mapp', () => ({ RequisitionsMap: (d: unknown[]) => d }))

describe('fetchRequisitionsByIdEmployee util', () => {
  beforeEach(() => {
    getResponseMock.mockReset()
    getResponseMock.mockResolvedValue({ data: { data: [{ billingrequisition_id: '1' }] } })
  })

  it('llena requisitions', async () => {
    const state: Partial<RequisitionsState> = { requisitions: [], loading: false, successGet: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as RequisitionsState) : partial)
    const get: Get = () => state as RequisitionsState

    await fetchRequisitionsByIdEmployee('emp1', set, get)

    expect(state.requisitions).toHaveLength(1)
    expect(state.successGet).toBe(true)
    expect(state.loading).toBe(false)
  })

  it('retorna advertencia si no hay datos', async () => {
    const state: Partial<RequisitionsState> = { requisitions: [], loading: false, successGet: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as RequisitionsState) : partial)
    const get: Get = () => state as RequisitionsState

    getResponseMock.mockResolvedValueOnce({ data: { data: [] } })

    await fetchRequisitionsByIdEmployee('emp1', set, get)

    expect(state.requisitions).toHaveLength(0)
    expect(state.warning).toBeDefined()
    expect(state.loading).toBe(false)
  })
})
