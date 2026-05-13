import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AuthState, Get, Set } from '../types'

import { deleteUserPasskey } from './deleteUserPasskey'

const deleteMock = vi.hoisted(() => vi.fn())

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => vi.fn(),
}))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pDelete: () => deleteMock,
}))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (e: unknown) => ({ message: String(e) }),
}))

describe('deleteUserPasskey util', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    deleteMock.mockResolvedValue({ status: 204, data: {} })
  })

  it('elimina el dispositivo passkey y lo retira del estado local', async () => {
    const state: Partial<AuthState> = {
      deletingUserPasskey: false,
      successDeleteUserPasskey: false,
      user: {
        idUser: 'u-1',
      } as AuthState['user'],
      userMfaById: {
        idUser: 'u-1',
        twoFactorEnabled: true,
        methods: [
          {
            method: 'Passkey',
            isEnabled: true,
            isVerified: true,
            destinationMasked: null,
            destination: null,
            challengeId: null,
          },
        ],
      },
      changeMfaMethodStatus: vi.fn().mockResolvedValue(undefined),
      userPasskeys: [
        {
          id: 'pk-1',
          idUser: 'u-1',
          friendlyName: 'iPhone Tania',
          createdAt: null,
          lastUsedAt: null,
        },
        {
          id: 'pk-2',
          idUser: 'u-1',
          friendlyName: 'Laptop 0123',
          createdAt: null,
          lastUsedAt: null,
        },
      ],
    }
    const set: Set = (partial) =>
      Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState

    const ok = await deleteUserPasskey(set, get, 'pk-1')

    expect(ok).toBe(true)
    expect(deleteMock).toHaveBeenCalledWith('/Auth/Passkeys/pk-1')
    expect(state.successDeleteUserPasskey).toBe(true)
    expect(state.userPasskeys).toEqual([
      {
        id: 'pk-2',
        idUser: 'u-1',
        friendlyName: 'Laptop 0123',
        createdAt: null,
        lastUsedAt: null,
      },
    ])
  })

  it('apaga el metodo de autenticacion con dispositivo al eliminar el ultimo dispositivo', async () => {
    const state: Partial<AuthState> = {
      deletingUserPasskey: false,
      successDeleteUserPasskey: false,
      user: {
        idUser: 'u-1',
      } as AuthState['user'],
      userMfaById: {
        idUser: 'u-1',
        twoFactorEnabled: true,
        methods: [
          {
            method: 'Passkey',
            isEnabled: true,
            isVerified: true,
            destinationMasked: null,
            destination: null,
            challengeId: null,
          },
        ],
      },
      changeMfaMethodStatus: vi.fn().mockResolvedValue(undefined),
      userPasskeys: [
        {
          id: 'pk-1',
          idUser: 'u-1',
          friendlyName: 'iPhone Tania',
          createdAt: null,
          lastUsedAt: null,
        },
      ],
    }
    const set: Set = (partial) =>
      Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState

    const ok = await deleteUserPasskey(set, get, 'pk-1')

    expect(ok).toBe(true)
    expect(state.changeMfaMethodStatus).toHaveBeenCalledWith({
      idUser: 'u-1',
      method: 'Passkey',
      isEnabled: false,
      idPasskey: 'pk-1',
    })
    expect(state.userPasskeys).toEqual([])
    expect(state.userMfaById?.methods[0]?.isEnabled).toBe(false)
  })
})
