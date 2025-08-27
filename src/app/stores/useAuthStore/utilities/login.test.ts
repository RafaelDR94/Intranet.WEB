import { describe, it, expect, vi } from 'vitest'
import { login } from './login'
import type { AuthState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({ data: { token: 'abc' } }) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('login util', () => {
  it('actualiza loginData y successLogin', async () => {
    const state: Partial<AuthState> = { loading: false, successLogin: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await login(set, get, { username: 'u', password: 'p' })
    expect(state.successLogin).toBe(true)
    expect(state.loginData?.token).toBe('abc')
  })
})
