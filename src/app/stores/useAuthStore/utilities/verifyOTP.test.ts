import { describe, it, expect, vi } from 'vitest'

import type { AuthState, Set, Get } from '../types'

import { setInterceptor } from './interceptor'
import { verifyOTP } from './verifyOTP'

import { validateOTP } from '@/app/context/AuthContext/utilities/AuthService'


vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  validateOTP: vi.fn(),
  readUser: vi.fn().mockResolvedValue({ user: { token: 'tok', email: 'a@a.com' } }),
}))
vi.mock('./interceptor', () => ({ setInterceptor: vi.fn() }))

describe('verifyOTP util', () => {
  it('valida otp y actualiza usuario', async () => {
    const state: Partial<AuthState> = { token: 'abc', user: null }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await verifyOTP(set, get, '123456')
    expect(validateOTP).toHaveBeenCalledWith('abc', '123456')
    expect(state.user).toBeTruthy()
    expect(state.token).toBe('tok')
    expect(setInterceptor).toHaveBeenCalledWith('tok')
  })
})
