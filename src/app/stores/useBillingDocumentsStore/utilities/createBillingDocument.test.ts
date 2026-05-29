import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { BillingDocumentsState, Set, Get } from '../types'

import { createBillingDocument } from './createBillingDocument'

import type { BillingDocumentPost } from '@/app/mappings/billingdocuments/billingdocuments.types'

const postMock = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => postMock }))
vi.mock('./fetchBillingDocuments', () => ({ fetchBillingDocuments: vi.fn(async () => {}) }))

describe('createBillingDocument util', () => {
  beforeEach(() => {
    postMock.mockReset()
  })

  it('marca successPost y limpia creating', async () => {
    postMock.mockResolvedValue({ data: { data: { billing_document_id: '2' } } })
    const state: Partial<BillingDocumentsState> = { creating: false, successPost: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const payload: BillingDocumentPost = { requisition_id: 'a', Document: 'doc' }
    const res = await createBillingDocument(set, get, payload)

    expect(res?.billing_document_id).toBe('2')
    expect(state.creating).toBe(false)
    expect(state.successPost).toBe(true)
  })

  it('usa el error_Message del backend cuando success es false', async () => {
    postMock.mockResolvedValue({
      data: {
        data: null,
        success: false,
        error_Message: 'Este documento ya se encuentra registrado',
        error_Code: 0,
      },
    })
    const state: Partial<BillingDocumentsState> = { creating: false, successPost: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const payload: BillingDocumentPost = { requisition_id: 'a', Document: 'doc' }
    const res = await createBillingDocument(set, get, payload)

    expect(res).toBeNull()
    expect(state.successPost).toBe(false)
    expect(state.error).toBe('Este documento ya se encuentra registrado')
  })
})
