import { describe, it, expect, vi } from 'vitest'
import { updateRequisition } from './updateRequisition'
import type { RequisitionsState, Set, Get } from '../types'
import type { RequitionPut } from '@/app/mappings/requisitions/requisitions.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({ data: { data: { id_billingrequisition: '1' } } }) }))
vi.mock('@/app/mappings/requisitions/requisitions.mapp', () => ({ RequisitionMap: (r: unknown) => r }))
vi.mock('./fetchRequisitions', () => ({ fetchRequisitions: vi.fn(async () => {}) }))

describe('updateRequisition util', () => {
  it('actualiza elemento y marca success', async () => {
    const state: RequisitionsState = {
      requisitions: [{ id_billingrequisition: '1', requisitionkey: '', id_Employee: '', employeename: '', idProject: '', projectname: '' }],
      loading: false, creating: false, updating: false, removing: false, updatingExcel: false,
      successGet: false, successPost: false, successPut: false, successDelete: false, successUpdateExcel: false,
      error: undefined, warning: undefined,
      fetchRequisitions: async () => {}, createRequisition: async () => null, updateRequisition: async () => null,
      deleteRequisition: async () => false, updateExcelRequisition: async () => null, reset: () => {}, resetFlags: () => {}
    }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state) : partial)
    const get: Get = () => state

    const payload: RequitionPut = { id_billingrequisition: '1', requisitionkey: 'k', employeename: 'n', projectname: 'p' }
    const res = await updateRequisition(set, get, payload)

    expect(res?.id_billingrequisition).toBe('1')
    expect(state.successPut).toBe(true)
  })
})
