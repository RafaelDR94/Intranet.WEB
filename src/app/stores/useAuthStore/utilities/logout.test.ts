import { describe, it, expect, vi } from 'vitest'
import { logout } from './logout'
import type { AuthState, Set } from '../types'
import type { User } from '@/app/context/AuthContext/types'

vi.mock('./interceptor', () => ({ setInterceptor: vi.fn() }))
vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  logoutUser: vi.fn(),
}))

describe('logout util', () => {
  it('limpia usuario y token', async () => {
    const state: Partial<AuthState> = { user: {} as unknown as User, token: 'abc' }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    localStorage.setItem('firebaseTokenDoc', 'fbt')
    localStorage.setItem('deviceIdDoc', 'did')
    await logout(set)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })
})
