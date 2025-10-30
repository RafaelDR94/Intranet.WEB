import { describe, it, expect, vi } from 'vitest'

import type { RequisitionsState, Set, Get } from '../types'

import { deleteRequisition } from './deleteRequisition'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pDelete: () => async () => ({}) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => e as Error }))

describe('deleteRequisition util', () => {
  it('elimina requisición y marca successDelete', async () => {
    const state: RequisitionsState = {
      requisitions: [{ billingrequisition_id: '1', requisitionkey: '', id_Employee: '', employeename: '', idProject: '', projectname: '' }],
      loading: false, creating: false, updating: false, removing: false, updatingExcel: false,
      successGet: false, successPost: false, successPut: false, successDelete: false, successUpdateExcel: false,
      error: undefined, warning: undefined,
      fetchRequisitions: async () => {}, createRequisition: async () => null, updateRequisition: async () => null,
      deleteRequisition: async () => false, updateExcelRequisition: async () => null, reset: () => {}, resetFlags: () => {}
    }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state) : partial)
    const get: Get = () => state

    const res = await deleteRequisition(set, get, '1')
    expect(res).toBe(true)
    expect(state.requisitions).toHaveLength(0)
    expect(state.successDelete).toBe(true)
  })
})
