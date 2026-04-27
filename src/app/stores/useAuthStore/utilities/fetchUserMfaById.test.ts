import { describe, expect, it, vi } from 'vitest'

import type { AuthState, Set } from '../types'

import { fetchUserMfaById } from './fetchUserMfaById'

const getSpy = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => vi.fn(),
}))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () =>
    getSpy.mockImplementation(async () => ({
      data: {
        data: {
          idUser: 'f0ccf87b-c135-476e-afe1-8b86a67269d5',
          twoFactorEnabled: false,
          methods: [
            {
              method: 'Email',
              isEnabled: true,
              isVerified: true,
              destinationMasked: 'cu***@gmail.com',
              challengeId: 'challenge-email',
            },
            {
              method: 'SMS',
              isEnabled: false,
              isVerified: false,
              destinationMasked: null,
              challengeId: null,
            },
          ],
        },
      },
    })),
}))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (e: unknown) => ({ message: String(e) }),
}))

describe('fetchUserMfaById util', () => {
  it('consulta MFA por id de usuario y guarda resultado mapeado', async () => {
    getSpy.mockClear()
    const state: Partial<AuthState> = {
      loading: false,
      fetchingUserMfaById: false,
      successUserMfaById: false,
      userMfaById: null,
      mfaSmsEnabled: true,
      mfaEmailEnabled: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )

    const response = await fetchUserMfaById(
      set,
      'f0ccf87b-c135-476e-afe1-8b86a67269d5',
    )

    expect(getSpy).toHaveBeenCalledWith(
      '/Users/Mfa/f0ccf87b-c135-476e-afe1-8b86a67269d5',
    )
    expect(response?.idUser).toBe('f0ccf87b-c135-476e-afe1-8b86a67269d5')
    expect(response?.twoFactorEnabled).toBe(false)
    expect(response?.methods).toEqual([
      {
        method: 'Email',
        isEnabled: true,
        isVerified: true,
        destinationMasked: 'cu***@gmail.com',
        challengeId: 'challenge-email',
      },
      {
        method: 'SMS',
        isEnabled: false,
        isVerified: false,
        destinationMasked: null,
        challengeId: null,
      },
    ])
    expect(state.successUserMfaById).toBe(true)
    expect(state.mfaEmailEnabled).toBe(true)
    expect(state.mfaSmsEnabled).toBe(false)
  })
})
