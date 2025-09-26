import { describe, it, expect, vi } from 'vitest'

import type { AuthState, Set, Get } from '../types'

import { authValidate } from './authValidate'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({}) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('authValidate util', () => {
  it('actualiza successAuthValidate', async () => {
    const state: Partial<AuthState> = { loading: false, successAuthValidate: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await authValidate(set, get, { token: 't' })
    expect(state.successAuthValidate).toBe(true)
  })
})
