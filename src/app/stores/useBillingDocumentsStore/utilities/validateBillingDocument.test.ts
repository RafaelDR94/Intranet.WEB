import { describe, it, expect, vi } from 'vitest'

import type { BillingDocumentsState, Set, Get } from '../types'

import { validateBillingDocument } from './validateBillingDocument'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({ data: { data: { id: '1' } } }) }))
vi.mock('./fetchBillingDocuments', () => ({ fetchBillingDocuments: vi.fn() }))
vi.mock('./fetchSatBillingDocument', () => ({ fetchSatBillingDocument: vi.fn() }))

describe('validateBillingDocument util', () => {
  it('marca succesValidate y limpia validating', async () => {
    const state: Partial<BillingDocumentsState> = { validating: false, succesValidate: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as BillingDocumentsState) : partial)
    const get: Get = () => state as BillingDocumentsState

    const res = await validateBillingDocument(set, get, ['1'])
    expect(res?.id).toBe('1')
    expect(state.validating).toBe(false)
    expect(state.succesValidate).toBe(true)
  })
})
