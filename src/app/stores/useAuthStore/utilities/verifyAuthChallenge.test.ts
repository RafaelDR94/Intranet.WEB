import { describe, expect, it, vi } from 'vitest'

import type { AuthState, Get, Set } from '../types'

import { verifyAuthChallenge } from './verifyAuthChallenge'

const postSpy = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => vi.fn(),
}))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pPost: () => postSpy,
}))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (e: unknown) => ({ message: String(e) }),
}))

describe('verifyAuthChallenge util', () => {
  it('envía challenge de Email con code y guarda verificación', async () => {
    postSpy.mockResolvedValueOnce({
      data: {
        challengeId: 'guid-email',
        verified: true,
        purpose: 'LoginMfa',
        nextStep: 'LoginCompleted',
        data: { token: 'abc123' },
      },
    })

    const state: Partial<AuthState> = {
      loading: false,
      verifyingAuthChallenge: false,
      successAuthChallengeVerification: false,
      authChallengeVerification: undefined,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )
    const get: Get = () => state as AuthState

    const response = await verifyAuthChallenge(set, get, {
      challengeId: 'guid-email',
      method: 'Email',
      code: '123456',
      verificationToken: null,
    })

    expect(postSpy).toHaveBeenCalledWith('/Auth/Challenge/Verify', {
      challengeId: 'guid-email',
      method: 'Email',
      code: '123456',
      verificationToken: null,
    })
    expect(response?.verified).toBe(true)
    expect(response?.purpose).toBe('LoginMfa')
    expect(state.successAuthChallengeVerification).toBe(true)
  })

  it('envía challenge de SMS con verificationToken', async () => {
    postSpy.mockResolvedValueOnce({
      data: {
        challengeId: 'guid-sms',
        verified: true,
        purpose: 'LoginMfa',
        nextStep: 'LoginCompleted',
        data: { token: 'xyz789' },
      },
    })

    const state: Partial<AuthState> = {
      loading: false,
      verifyingAuthChallenge: false,
      successAuthChallengeVerification: false,
      authChallengeVerification: undefined,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )
    const get: Get = () => state as AuthState

    await verifyAuthChallenge(set, get, {
      challengeId: 'guid-sms',
      method: 'SMS',
      code: null,
      verificationToken: 'token-o-firebase-token',
    })

    expect(postSpy).toHaveBeenCalledWith('/Auth/Challenge/Verify', {
      challengeId: 'guid-sms',
      method: 'SMS',
      code: null,
      verificationToken: 'token-o-firebase-token',
    })
    expect(state.successAuthChallengeVerification).toBe(true)
  })
})
