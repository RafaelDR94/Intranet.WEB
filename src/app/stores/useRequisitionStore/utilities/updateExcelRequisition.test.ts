import { describe, it, expect, vi } from 'vitest'

import type { RequisitionsState, Set, Get } from '../types'

import { updateExcelRequisition } from './updateExcelRequisition'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { data: { billingrequisition_id: '1', rowsWithMissingData: [] } } }) }))
vi.mock('@/app/mappings/requisitions/requisitions.mapp', () => ({ RequisitionMap: (r: unknown) => r }))
vi.mock('./fetchRequisitions', () => ({ fetchRequisitions: vi.fn(async () => {}) }))

describe('updateExcelRequisition util', () => {
  it('actualiza vía excel y marca successUpdateExcel', async () => {
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

    const file = new File([''], 'test.xlsx')
    const res = await updateExcelRequisition(set, get, file)
    expect(res?.billingrequisition_id).toBe('1')
    expect(state.successUpdateExcel).toBe(true)
  })
})
