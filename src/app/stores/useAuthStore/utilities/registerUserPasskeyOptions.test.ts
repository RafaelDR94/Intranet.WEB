import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthState, Get, Set } from '../types'

import { registerUserPasskeyOptions } from './registerUserPasskeyOptions'

const registerPasskeyMock = vi.hoisted(() => vi.fn())

vi.mock('@/app/services/passkeys/PasskeyService', () => ({
  PasskeyService: {
    registerPasskey: registerPasskeyMock,
  },
}))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (e: unknown) => ({ message: String(e) }),
}))

describe('registerUserPasskeyOptions util', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    registerPasskeyMock.mockResolvedValue(undefined)
  })

  it('delegates passkey registration in PasskeyService', async () => {
    const state: Partial<AuthState> = {
      registeringUserPasskey: false,
      successRegisterUserPasskey: false,
      user: { idUser: 'u-1' } as AuthState['user'],
      fetchUserPasskeys: vi.fn().mockResolvedValue([]),
      fetchUserMfaById: vi.fn().mockResolvedValue(null),
    }
    const set: Set = (partial) =>
      Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState

    const ok = await registerUserPasskeyOptions(set, get, 'iPhone Tania')

    expect(ok).toBe(true)
    expect(registerPasskeyMock).toHaveBeenCalledWith('iPhone Tania')
    expect(state.fetchUserPasskeys).toHaveBeenCalledWith('u-1')
    expect(state.fetchUserMfaById).toHaveBeenCalledWith('u-1')
    expect(state.successRegisterUserPasskey).toBe(true)
    expect(state.registeringUserPasskey).toBe(false)
  })
})
