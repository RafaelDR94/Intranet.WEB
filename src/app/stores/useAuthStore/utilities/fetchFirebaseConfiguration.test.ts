import { describe, it, expect, vi } from 'vitest'

import type { AuthState, Set, Get } from '../types'

import { fetchFirebaseConfiguration } from './fetchFirebaseConfiguration'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pGet: () => async () => ({ data: { apiKey: 'k' } }) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('fetchFirebaseConfiguration util', () => {
  it('guarda firebaseConfig', async () => {
    const state: Partial<AuthState> = { loading: false, successFirebaseConfig: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await fetchFirebaseConfiguration(set, get)
    expect(state.firebaseConfig?.apiKey).toBe('k')
    expect(state.successFirebaseConfig).toBe(true)
  })
})
