import { describe, it, expect, vi } from 'vitest'

import type { AuthState, Set, Get } from '../types'

import { changePassword } from './changePassword'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({}) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('changePassword util', () => {
  it('actualiza successChangePassword y la contraseña del usuario', async () => {
    const state: Partial<AuthState> = {
      loading: false,
      successChangePassword: false,
      user: { password: 'ClaveAnterior1' } as AuthState['user'],
    }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await changePassword(set, get, {
      email: 'user@test.com',
      newPassword: 'NuevaClave123',
      changePassword: true,
    })
    expect(state.successChangePassword).toBe(true)
    expect(state.user?.password).toBe('NuevaClave123')
  })
})
