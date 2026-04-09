import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { BillingDocumentsState, Set, Get } from '../types'

import { fetchSatBillingDocument } from './fetchSatBillingDocument'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
const getReqMock = vi.fn(async () => ({ data: { data: { validas: [{ id: '1' }], noValidas: [], prohibidas: [], efos: [] } } }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => getReqMock }))
vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({ BillingDocumentsMap: (d: unknown[]) => d }))

describe('fetchSatBillingDocument util', () => {
  beforeEach(() => {
    getReqMock.mockClear()
  })

  it('usa endpoint SAT global por default', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocumentsValid: [], loadigSat: false, successGetSat: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    await fetchSatBillingDocument(set, get, true)

    expect(getReqMock).toHaveBeenCalledWith('/Billings/GetAllSATBillingDocuments')
  })

  it('usa endpoint SAT por idEmployee cuando se envía filtro', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocumentsValid: [], loadigSat: false, successGetSat: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    await fetchSatBillingDocument(set, get, true, { idEmployee: 'emp-1' })

    expect(getReqMock).toHaveBeenCalledWith('/Billings/GetAllSATBillingDocumentsByEmployee/emp-1')
  })

  it('usa endpoint SAT por idRequisition cuando se envía filtro', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocumentsValid: [], loadigSat: false, successGetSat: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    await fetchSatBillingDocument(set, get, true, { idRequisition: 'req-1' })

    expect(getReqMock).toHaveBeenCalledWith('/Billings/GetAllSATBillingDocumentsByRequisition/req-1')
  })

  it('llena billingDocumentsValid y apaga loadigSat', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocumentsValid: [], loadigSat: false, successGetSat: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    await fetchSatBillingDocument(set, get)

    expect(state.billingDocumentsValid).toHaveLength(1)
    expect(state.loadigSat).toBe(false)
    expect(state.successGetSat).toBe(true)
  })
})
