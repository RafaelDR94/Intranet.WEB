import { describe, it, expect, vi } from 'vitest'
import { recoverPassword } from './recoverPassword'
import type { AuthState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({}) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('recoverPassword util', () => {
  it('actualiza successRecoverPassword', async () => {
    const state: Partial<AuthState> = { loading: false, successRecoverPassword: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await recoverPassword(set, get, { username: 'u' })
    expect(state.successRecoverPassword).toBe(true)
  })
})
