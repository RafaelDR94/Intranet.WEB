import { describe, expect, it, vi } from 'vitest'

import type { AuthState, Set } from '../types'

import { fetchRecoverChannels } from './fetchRecoverChannels'

const getSpy = vi.fn()

vi.mock('@/app/utilities/Http/requireGateway', () => ({
  requireGateway: () => vi.fn(),
}))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({
  pGet: () => getSpy.mockImplementation(async () => ({
    data: {
      data: [
        { type: 'Email', value: 'ad***@dr.com' },
        { type: 'SMS', value: null },
      ],
    },
  })),
}))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({
  normalizeApiError: (e: unknown) => ({ message: String(e) }),
}))

describe('fetchRecoverChannels util', () => {
  it('guarda los canales de recuperacion', async () => {
    getSpy.mockClear()
    const state: Partial<AuthState> = {
      loading: false,
      fetchingRecoverChannels: false,
      successRecoverChannels: false,
      recoverChannels: [],
    }
    const set: Set = (partial) =>
      Object.assign(
        state,
        typeof partial === 'function' ? partial(state as AuthState) : partial,
      )

    const response = await fetchRecoverChannels(set, 'test@drsecurity.net')

    expect(response).toEqual([
      { type: 'Email', value: 'ad***@dr.com' },
      { type: 'SMS', value: null },
    ])
    expect(getSpy).toHaveBeenCalledWith(
      '/Auth/AuthenticationMethods?email=test%40drsecurity.net',
    )
    expect(state.successRecoverChannels).toBe(true)
    expect(state.recoverChannels).toEqual(response)
  })
})
