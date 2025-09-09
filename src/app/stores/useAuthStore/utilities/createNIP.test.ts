import { describe, it, expect, vi } from 'vitest'

import type { AuthState, Set, Get } from '../types'

import { createNip } from './createNIP'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPost: () => async () => ({}) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('createNip util', () => {
  it('actualiza successCreateNIP', async () => {
    const state: Partial<AuthState> = { loading: false, successCreateNIP: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await createNip(set, get, { idUser: 1, nip: '1234' })
    expect(state.successCreateNIP).toBe(true)
  })
})
