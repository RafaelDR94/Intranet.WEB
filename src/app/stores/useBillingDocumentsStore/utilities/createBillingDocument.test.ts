import { describe, it, expect, vi } from 'vitest'

import type { BillingDocumentsState, Set, Get } from '../types'

import { createBillingDocument } from './createBillingDocument'

import type { BillingDocumentPost } from '@/app/mappings/billingdocuments/billingdocuments.types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { data: { billing_document_id: '2' } } }) }))
vi.mock('./fetchBillingDocuments', () => ({ fetchBillingDocuments: vi.fn(async () => {}) }))

describe('createBillingDocument util', () => {
  it('marca successPost y limpia creating', async () => {
    const state: Partial<BillingDocumentsState> = { creating: false, successPost: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const payload: BillingDocumentPost = { requisition_id: 'a', Document: 'doc' }
    const res = await createBillingDocument(set, get, payload)

    expect(res?.billing_document_id).toBe('2')
    expect(state.creating).toBe(false)
    expect(state.successPost).toBe(true)
  })
})
