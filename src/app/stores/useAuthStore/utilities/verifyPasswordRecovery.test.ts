import { describe, expect, it } from 'vitest'

import type { AuthState, Get, Set } from '../types'

import { verifyPasswordRecoveryCode } from './verifyPasswordRecoveryCode'
import { verifyPasswordRecoverySms } from './verifyPasswordRecoverySms'

describe('password recovery verification utils', () => {
  it('verifica codigo en modo mock', async () => {
    process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY = 'true'

    const state: Partial<AuthState> = {
      loading: false,
      verifyingPasswordRecovery: false,
      successPasswordRecoveryVerification: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )
    const get: Get = () => state as AuthState

    const response = await verifyPasswordRecoveryCode(set, get, {
      challengeId: 'mock-email-challenge',
      code: '123456',
    })

    expect(response).toEqual({
      message: 'Codigo validado correctamente.',
      challengeId: 'mock-email-challenge',
      nextStep: 'ResetPassword',
    })
    expect(state.successPasswordRecoveryVerification).toBe(true)
    expect(state.passwordRecoveryVerification?.challengeId).toBe('mock-email-challenge')
    delete process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY
  })

  it('verifica sms en modo mock', async () => {
    process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY = 'true'

    const state: Partial<AuthState> = {
      loading: false,
      verifyingPasswordRecovery: false,
      successPasswordRecoveryVerification: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )
    const get: Get = () => state as AuthState

    const response = await verifyPasswordRecoverySms(set, get, {
      challengeId: 'mock-sms-challenge',
      token: '123456',
    })

    expect(response).toEqual({
      message: 'Codigo validado correctamente.',
      challengeId: 'mock-sms-challenge',
      nextStep: 'ResetPassword',
    })
    expect(state.successPasswordRecoveryVerification).toBe(true)
    expect(state.passwordRecoveryVerification?.challengeId).toBe('mock-sms-challenge')
    delete process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY
  })
})
