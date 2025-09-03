import { describe, it, expect, vi } from 'vitest'
import { fetchBillingDocumentByIdRequisition } from './fetchBillingDocumentByIdRequisition'
import type { BillingDocumentsState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { data: [{ billingdocument_id: '1' }] } }) }))
vi.mock('@/app/mappings/billingdocuments/billingdocuments.mapper', () => ({ BillingDocumentsMap: (d: unknown[]) => d }))

describe('fetchBillingDocumentByIdRequisition util', () => {
  it('llena billingDocuments y apaga loading', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocuments: [], loading: false, successGet: false, successGetById: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const res = await fetchBillingDocumentByIdRequisition('1', set, get)

    expect(res?.billingdocument_id).toBe('1')
    expect(state.billingDocuments).toHaveLength(1)
    expect(state.loading).toBe(false)
    expect(state.successGet).toBe(true)
    expect(state.successGetById).toBe(true)
  })
})
