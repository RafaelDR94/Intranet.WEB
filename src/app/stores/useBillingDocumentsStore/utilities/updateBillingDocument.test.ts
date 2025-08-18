import { describe, it, expect, vi } from 'vitest'
import { updateBillingDocument } from './updateBillingDocument'
import type { BillingDocumentsState, Set, Get } from '../types'
import type { BillingDocumentPut } from '@/app/mappings/billingdocuments/billingdocuments.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({ data: { data: { billing_document_id: '1' } } }) }))
vi.mock('./fetchBillingDocuments', () => ({ fetchBillingDocuments: vi.fn(async () => {}) }))

describe('updateBillingDocument util', () => {
  it('marca successPut y limpia updating', async () => {
    const state: Partial<BillingDocumentsState> = { updating: false, successPut: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const payload: BillingDocumentPut = { billing_document_id: '1', requisition_id: 'a', status_id: 'b', Document: 'doc', downloaded: false }
    const res = await updateBillingDocument(set, get, payload)

    expect(res?.billing_document_id).toBe('1')
    expect(state.updating).toBe(false)
    expect(state.successPut).toBe(true)
  })
})
