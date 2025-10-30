import { describe, it, expect, vi } from 'vitest'

import type { RequisitionsState, Set, Get } from '../types'

import { fetchCurrentRequisition } from './fetchCurrentRequisition'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ billingrequisition_id: '1' }] } }) }))
vi.mock('@/app/mappings/requisitions/requisitions.mapp', () => ({ RequisitionMap: (d: unknown) => d }))

describe('fetchCurrentRequisition util', () => {
  it('llena currentRequisition y apaga gettincurrentReq', async () => {
    const state: Partial<RequisitionsState> = { requisitions: [], currentRequisition: undefined, gettincurrentReq: false, succesgetingCurrent: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as RequisitionsState) : partial)
    const get: Get = () => state as RequisitionsState

    await fetchCurrentRequisition(set, get, '1', true)

    expect(state.currentRequisition?.billingrequisition_id).toBe('1')
    expect(state.gettincurrentReq).toBe(false)
    expect(state.succesgetingCurrent).toBe(true)
  })
})
