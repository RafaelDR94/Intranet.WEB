import { describe, it, expect, vi } from 'vitest'
import { changePassword } from './changePassword'
import type { AuthState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({}) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('changePassword util', () => {
  it('actualiza successChangePassword', async () => {
    const state: Partial<AuthState> = { loading: false, successChangePassword: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await changePassword(set, get, { idUser: 1, password: 'a', newPassword: 'b' })
    expect(state.successChangePassword).toBe(true)
  })
})
