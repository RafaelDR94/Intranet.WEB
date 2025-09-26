import { describe, it, expect, vi } from 'vitest'

import type { RequisitionsState, Set, Get } from '../types'

import { createRequisition } from './createRequisition'

import type { RequitionPost } from '@/app/mappings/requisitions/requisitions.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { data: { billingrequisition_id: '2' } } }) }))
vi.mock('@/app/mappings/requisitions/requisitions.mapp', () => ({ RequisitionMap: (r: unknown) => r }))
vi.mock('./fetchRequisitions', () => ({ fetchRequisitions: vi.fn(async () => {}) }))

describe('createRequisition util', () => {
  it('marca successPost y limpia creating', async () => {
    const state: Partial<RequisitionsState> = { creating: false, successPost: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as RequisitionsState) : partial)
    const get: Get = () => state as RequisitionsState

    const payload: RequitionPost = { requisitionkey: 'a', employeename: 'b', projectname: 'c' }
    const res = await createRequisition(set, get, payload)

    expect(res?.billingrequisition_id).toBe('2')
    expect(state.creating).toBe(false)
    expect(state.successPost).toBe(true)
  })
})
