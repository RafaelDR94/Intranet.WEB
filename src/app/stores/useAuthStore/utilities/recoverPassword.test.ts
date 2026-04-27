import { describe, it, expect, vi } from 'vitest'

import type { AuthState, Set, Get } from '../types'

import { recoverPassword } from './recoverPassword'

const postSpy = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pPost: () =>
    postSpy.mockImplementation(async () => ({
      data: {
        data: {
          type: 'Email',
          challengeId: 'uuid',
          emailMasked: 'ta***@drsecurity.net',
          message: 'Correo enviado',
          expiresInSeconds: 300,
          nextStep: 'VerifyCode',
        },
      },
    })),
}))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('recoverPassword util', () => {
  it('guarda el challenge de recuperacion', async () => {
    process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY = 'false'
    const state: Partial<AuthState> = { loading: false, successRecoverPassword: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    const response = await recoverPassword(set, get, {
      email: 'u',
      type: 'Email',
      challengeId: 'prev-challenge',
      idUser: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    })
    expect(postSpy).toHaveBeenCalledWith('/Auth/Challenge/Start', {
      purpose: 'PasswordRecovery',
      method: 'Email',
      email: 'u',
      challengeId: 'prev-challenge',
      idUser: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    })
    expect(state.successRecoverPassword).toBe(true)
    expect(state.recoverPasswordChallenge?.challengeId).toBe('uuid')
    expect(response?.emailMasked).toBe('ta***@drsecurity.net')
    delete process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY
  })
})
