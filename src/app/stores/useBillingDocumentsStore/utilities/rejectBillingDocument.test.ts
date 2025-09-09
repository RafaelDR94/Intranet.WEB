import { describe, it, expect, vi } from 'vitest'

import type { BillingDocumentsState, Set, Get } from '../types'

import { rejectBillingDocument } from './rejectBillingDocument'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('./fetchBillingDocuments', () => ({ fetchBillingDocuments: vi.fn() }))
vi.mock('./fetchSatBillingDocument', () => ({ fetchSatBillingDocument: vi.fn() }))
vi.mock('./fetchBillingDocumentByIdRequisition', () => ({ fetchBillingDocumentByIdRequisition: vi.fn() }))

describe('rejectBillingDocument util', () => {
  it('marca succesReject y limpia rejecting', async () => {
    const state: Partial<BillingDocumentsState> = { rejecting: false, succesReject: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const res = await rejectBillingDocument(set, get, { id: '1', comment: 'c', type: true })
    expect(res?.id).toBe('1')
    expect(state.rejecting).toBe(false)
    expect(state.succesReject).toBe(true)
  })
})
