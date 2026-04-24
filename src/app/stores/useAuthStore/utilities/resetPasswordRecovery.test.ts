import { describe, expect, it, vi } from 'vitest'

import type { AuthState, Get, Set } from '../types'

import { resetPasswordRecovery } from './resetPasswordRecovery'

const mockPost = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => vi.fn(),
}))

vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pPost: () => mockPost,
}))

vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (e: unknown) => ({ message: String(e) }),
}))

describe('resetPasswordRecovery util', () => {
  it('responde exitosamente en modo mock', async () => {
    process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY = 'true'

    const state: Partial<AuthState> = {
      loading: false,
      resettingPasswordRecovery: false,
      successResetPasswordRecovery: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )
    const get: Get = () => state as AuthState

    const response = await resetPasswordRecovery(set, get, {
      challengeId: 'mock-reset-challenge',
      newPassword: 'NuevaSegura123!',
      confirmPassword: 'NuevaSegura123!',
    })

    expect(response).toEqual({
      success: true,
      message: 'Contrasena actualizada correctamente.',
      nextStep: 'Login',
    })
    expect(state.successResetPasswordRecovery).toBe(true)
    expect(state.passwordRecoveryResetResponse?.success).toBe(true)
    delete process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY
  })

  it('consume el backend real y guarda la respuesta del reset', async () => {
    process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY = 'false'
    mockPost.mockResolvedValueOnce({
      data: {
        data: {
          success: true,
          message: 'Contrasena actualizada correctamente.',
          nextStep: 'Login',
        },
        success: true,
        error_Message: '',
        error_Code: 0,
      },
    })

    const state: Partial<AuthState> = {
      loading: false,
      resettingPasswordRecovery: false,
      successResetPasswordRecovery: false,
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )
    const get: Get = () => state as AuthState

    const response = await resetPasswordRecovery(set, get, {
      challengeId: 'challenge-1',
      newPassword: 'NuevaSegura123!',
      confirmPassword: 'NuevaSegura123!',
    })

    expect(mockPost).toHaveBeenCalledWith('/Auth/ResetPassword', {
      challengeId: 'challenge-1',
      newPassword: 'NuevaSegura123!',
      confirmPassword: 'NuevaSegura123!',
    })
    expect(response).toEqual({
      success: true,
      message: 'Contrasena actualizada correctamente.',
      nextStep: 'Login',
    })
    expect(state.successResetPasswordRecovery).toBe(true)
    expect(state.passwordRecoveryResetResponse?.success).toBe(true)
    delete process.env.NEXT_PUBLIC_MOCK_PASSWORD_RECOVERY
  })
})
