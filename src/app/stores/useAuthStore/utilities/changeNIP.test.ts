import { describe, it, expect, vi } from 'vitest'
import { changeNip } from './changeNIP'
import type { AuthState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({}) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('changeNip util', () => {
  it('actualiza successChangeNIP', async () => {
    const state: Partial<AuthState> = { loading: false, successChangeNIP: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await changeNip(set, get, { idUser: 1, nip: '1234' })
    expect(state.successChangeNIP).toBe(true)
  })
})
