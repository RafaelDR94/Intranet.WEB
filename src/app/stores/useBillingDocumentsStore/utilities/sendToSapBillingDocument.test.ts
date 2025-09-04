import { describe, it, expect, vi } from 'vitest'
import { sendToSapBillingDocument } from './sendToSapBillingDocument'
import type { BillingDocumentsState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('./fetchBillingDocuments', () => ({ fetchBillingDocuments: vi.fn() }))
vi.mock('./fetchSatBillingDocument', () => ({ fetchSatBillingDocument: vi.fn() }))

describe('sendToSapBillingDocument util', () => {
  it('marca succesSend y limpia sending', async () => {
    const state: Partial<BillingDocumentsState> = { sending: false, succesSend: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const res = await sendToSapBillingDocument(set, get, ['1'])
    expect(res?.id).toBe('1')
    expect(state.sending).toBe(false)
    expect(state.succesSend).toBe(true)
  })
})
