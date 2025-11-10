import { describe, it, expect, vi } from 'vitest'

import type { AuthState, Set, Get } from '../types'

import { login } from './login'

import type { LoginCredentials } from '@/app/context/AuthContext/types'

const setInterceptorMock = vi.hoisted(() => vi.fn())
const fetchUserSignatureMock = vi.hoisted(() => vi.fn())

vi.mock('./interceptor', () => ({ setInterceptor: setInterceptorMock }))
vi.mock('./fetchUserSignature', () => ({
  fetchUserSignature: fetchUserSignatureMock,
}))
vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  authenticateUser: vi.fn(),
  readUser: vi.fn().mockResolvedValue({
    user: {
      token: 'abc',
      email: 'a@a.com',
      idEmployee: 'emp-1',
      idUser: 'usr-1',
      signature: '',
    },
  }),
  saveLastUserRemebered: vi.fn(),
  forgetUser: vi.fn(),
  saveUser: vi.fn(),
}))

describe('login util', () => {
  beforeEach(() => {
    fetchUserSignatureMock.mockReset()
    setInterceptorMock.mockReset()
  })

  it('actualiza usuario y token', async () => {
    const state: Partial<AuthState> = { remeberMe: false, offlineMode: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    const { saveLastUserRemebered, saveUser } = await import('@/app/context/AuthContext/utilities/AuthService')
    const credentials: LoginCredentials = { email: 'a@a.com', password: '123' }

    fetchUserSignatureMock.mockResolvedValue('data:image/png;base64,remote')
    state.remeberMe = true

    await login(set, get, credentials)
    expect(state.user?.signature).toBe('data:image/png;base64,remote')
    expect(state.signature).toBe('data:image/png;base64,remote')
    expect(saveUser).toHaveBeenCalledWith(expect.objectContaining({ signature: 'data:image/png;base64,remote' }))
    expect(saveLastUserRemebered).toHaveBeenCalledWith(
      expect.objectContaining({ signature: 'data:image/png;base64,remote' })
    )
    expect(state.userRemebered?.signature).toBe('data:image/png;base64,remote')
    expect(state.token).toBe('abc')
    expect(state.successLogin).toBe(true)
    expect(setInterceptorMock).toHaveBeenCalledWith('abc')
  })
})
