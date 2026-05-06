import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthState, Get, Set } from '../types'

import { changeMfaMethodStatus } from './changeMfaMethodStatus'

const putMock = vi.hoisted(() => vi.fn())

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => putMock }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('changeMfaMethodStatus util', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    putMock.mockResolvedValue({ status: 200, data: {} })
  })

  it('llama el endpoint de método MFA con payload SMS', async () => {
    const state: Partial<AuthState> = {
      changingMFAMethod: false,
      successChangeMFAMethod: false,
      mfaSmsEnabled: false,
      mfaEmailEnabled: false,
      userMfaById: {
        idUser: 'F0CCF87B-C135-476E-AFE1-8B86A67269D5',
        twoFactorEnabled: false,
        methods: [
          {
            method: 'SMS',
            isEnabled: false,
            isVerified: false,
            destinationMasked: null,
            destination: null,
            challengeId: null,
          },
          {
            method: 'Email',
            isEnabled: false,
            isVerified: true,
            destinationMasked: 'cu***@gmail.com',
            destination: 'cuenta@gmail.com',
            challengeId: null,
          },
        ],
      },
    }
    const set: Set = (partial) =>
      Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState

    await changeMfaMethodStatus(set, get, {
      idUser: 'F0CCF87B-C135-476E-AFE1-8B86A67269D5',
      method: 'SMS',
      isEnabled: true,
      destination: '5512345678',
    })

    expect(putMock).toHaveBeenCalledWith('/Users/Mfa/Method', {
      idUser: 'F0CCF87B-C135-476E-AFE1-8B86A67269D5',
      method: 'SMS',
      isEnabled: true,
      destination: '5512345678',
    })
    expect(state.successChangeMFAMethod).toBe(true)
    expect(state.mfaSmsEnabled).toBe(true)
    expect(state.userMfaById?.twoFactorEnabled).toBe(false)
  })

  it('normaliza method EMAIL al mapear payload', async () => {
    const state: Partial<AuthState> = {
      changingMFAMethod: false,
      successChangeMFAMethod: false,
      mfaSmsEnabled: true,
      mfaEmailEnabled: true,
      userMfaById: {
        idUser: 'F0CCF87B-C135-476E-AFE1-8B86A67269D5',
        twoFactorEnabled: true,
        methods: [
          {
            method: 'SMS',
            isEnabled: false,
            isVerified: false,
            destinationMasked: null,
            destination: null,
            challengeId: null,
          },
          {
            method: 'Email',
            isEnabled: true,
            isVerified: true,
            destinationMasked: 'cu***@gmail.com',
            destination: 'cuenta@gmail.com',
            challengeId: null,
          },
        ],
      },
    }
    const set: Set = (partial) =>
      Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState

    await changeMfaMethodStatus(set, get, {
      idUser: 'F0CCF87B-C135-476E-AFE1-8B86A67269D5',
      method: 'Email',
      isEnabled: false,
      destination: 'cuenta@gmail.com',
    })

    expect(putMock).toHaveBeenCalledWith('/Users/Mfa/Method', {
      idUser: 'F0CCF87B-C135-476E-AFE1-8B86A67269D5',
      method: 'Email',
      isEnabled: false,
      destination: 'cuenta@gmail.com',
    })
    expect(state.successChangeMFAMethod).toBe(true)
    expect(state.mfaEmailEnabled).toBe(false)
    expect(state.userMfaById?.twoFactorEnabled).toBe(true)
  })
})
