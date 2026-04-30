import { describe, expect, it, vi } from 'vitest'

import type { AuthState, Set } from '../types'

import { fetchUserPasskeys } from './fetchUserPasskeys'

const getSpy = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => vi.fn(),
}))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () =>
    getSpy.mockImplementation(async () => ({
      data: {
        data: [
          {
            id: 'pk-1',
            idUser: 'u-1',
            friendlyName: 'iPhone Tania',
            createdAt: '2026-04-29T10:00:00Z',
            lastUsedAt: '2026-04-29T11:00:00Z',
          },
          {
            id: 'pk-2',
            idUser: 'u-1',
            friendlyName: 'Laptop 0123',
            createdAt: null,
            lastUsedAt: null,
          },
        ],
      },
    })),
}))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (e: unknown) => ({ message: String(e) }),
}))

describe('fetchUserPasskeys util', () => {
  it('consulta passkeys por id de usuario y persiste el resultado', async () => {
    getSpy.mockClear()
    const state: Partial<AuthState> = {
      loading: false,
      fetchingUserPasskeys: false,
      successUserPasskeys: false,
      userPasskeys: [],
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )

    const response = await fetchUserPasskeys(set, 'u-1')

    expect(getSpy).toHaveBeenCalledWith('/Auth/Passkeys/User/u-1')
    expect(response).toEqual([
      {
        id: 'pk-1',
        idUser: 'u-1',
        friendlyName: 'iPhone Tania',
        createdAt: '2026-04-29T10:00:00Z',
        lastUsedAt: '2026-04-29T11:00:00Z',
      },
      {
        id: 'pk-2',
        idUser: 'u-1',
        friendlyName: 'Laptop 0123',
        createdAt: null,
        lastUsedAt: null,
      },
    ])
    expect(state.successUserPasskeys).toBe(true)
    expect(state.userPasskeys).toHaveLength(2)
  })
})
