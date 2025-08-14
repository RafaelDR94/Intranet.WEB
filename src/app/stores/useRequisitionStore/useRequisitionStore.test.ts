import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Requisition } from '@/app/mappings/requisitions/requisitions.types'
import type { Set } from './types'

vi.mock('./utilities', () => ({
  fetchRequisitions: vi.fn(async (set: Set) => set({ requisitions: [{ billingrequisition_id: '1' }as any], loading: false })),
  createRequisition: vi.fn(async (set: Set, _get: unknown, _payload: unknown) => {
    set({ successPost: true }); return { billingrequisition_id: '2' } as Requisition
  }),
  updateRequisition: vi.fn(async (set: Set) => { set({ successPut: true }); return null }),
  deleteRequisition: vi.fn(async (set: Set) => { set({ successDelete: true }); return true }),
  updateExcelRequisition: vi.fn(async (set: Set) => { set({ successUpdateExcel: true }); return null })
}))

import { useRequisitionsStore } from './useRequisitionStore'

describe('useRequisitionsStore', () => {
  beforeEach(() => {
    useRequisitionsStore.setState({
      requisitions: [], loading: false, creating: false, updating: false, removing: false, updatingExcel: false,
      successGet: false, successPost: false, successPut: false, successDelete: false, successUpdateExcel: false,
      error: undefined, warning: undefined
    })
  })

  it('inicia vacío', () => {
    expect(useRequisitionsStore.getState().requisitions).toEqual([])
  })

  it('fetchRequisitions carga datos', async () => {
    await useRequisitionsStore.getState().fetchRequisitions()
    expect(useRequisitionsStore.getState().requisitions).toHaveLength(1)
  })
})
