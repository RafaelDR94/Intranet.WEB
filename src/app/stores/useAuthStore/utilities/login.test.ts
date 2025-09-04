import { describe, it, expect, vi } from 'vitest'
import { login } from './login'
import type { AuthState, Set, Get } from '../types'
import type { LoginCredentials } from '@/app/context/AuthContext/types'

vi.mock('./interceptor', () => ({ setInterceptor: vi.fn() }))
vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  authenticateUser: vi.fn(),
  readUser: vi.fn().mockResolvedValue({ user: { token: 'abc', email: 'a@a.com' } }),
  saveLastUserRemebered: vi.fn(),
  forgetUser: vi.fn(),
}))

describe('login util', () => {
  it('actualiza usuario y token', async () => {
    const state: Partial<AuthState> = { remeberMe: false, offlineMode: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    const credentials: LoginCredentials = { email: 'a@a.com', password: '123' }
    await login(set, get, credentials)
    expect(state.user).toBeTruthy()
    expect(state.token).toBe('abc')
    expect(state.successLogin).toBe(true)
  })
})
