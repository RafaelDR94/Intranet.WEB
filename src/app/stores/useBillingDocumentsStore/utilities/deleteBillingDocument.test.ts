import { describe, it, expect, vi } from 'vitest'
import { deleteBillingDocument } from './deleteBillingDocument'
import type { BillingDocumentsState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pDelete: () => async () => ({ data: { } }) }))

describe('deleteBillingDocument util', () => {
  it('elimina documento y marca successDelete', async () => {
    const state: Partial<BillingDocumentsState> = { billingDocuments: [{ billingdocument_id: '1' } as any], removing: false, successDelete: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const res = await deleteBillingDocument(set, get, '1')

    expect(res).toBe(true)
    expect((state.billingDocuments as any[]).length).toBe(0)
    expect(state.successDelete).toBe(true)
  })
})
