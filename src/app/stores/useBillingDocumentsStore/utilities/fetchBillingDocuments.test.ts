import { describe, expect, it, vi } from 'vitest'

import type { BillingDocumentsState, Get, Set } from '../types'

import { fetchBillingDocuments } from './fetchBillingDocuments'

const getReqMock = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => vi.fn(),
}))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => getReqMock,
}))

describe('fetchBillingDocuments util', () => {
  it('fills documents using the employee filter and stores active context', async () => {
    getReqMock.mockResolvedValue({
      data: { data: { today: [{ billingdocument_id: '1' }], notToday: [] } },
    })

    const state: Partial<BillingDocumentsState> = {
      billingDocuments: [],
      billingDocumentnotToday: [],
      activeDocumentsFilter: { filterValue: '3' },
      loading: false,
      successGet: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function'
          ? partial(state as BillingDocumentsState)
          : partial,
      )
    const get: Get = () => state as BillingDocumentsState

    await fetchBillingDocuments(set, get, false, {
      filterValue: '5',
      idEmployee: 'emp-1',
    })

    expect(getReqMock).toHaveBeenCalledWith(
      '/Billings/BillingDocumentByFilter/5?idEmployee=emp-1',
    )
    expect(state.billingDocuments).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
    expect(state.activeDocumentsFilter).toEqual({
      filterValue: '5',
      idEmployee: 'emp-1',
    })
  })
})
