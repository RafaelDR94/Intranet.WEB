import { describe, it, expect, vi } from 'vitest'
import { changeNipStatusByIdUser } from './changeNIPStatusByIdUser'
import type { AuthState, Set, Get } from '../types'

vi.mock('@/app/utilities/Http/requireGateway', () => ({ requireGateway: () => vi.fn() }))
vi.mock('@/app/utilities/Http/promisifyIntranet', () => ({ pPut: () => async () => ({}) }))
vi.mock('@/app/utilities/Http/normalizeApiError', () => ({ normalizeApiError: (e: unknown) => ({ message: String(e) }) }))

describe('changeNipStatusByIdUser util', () => {
  it('actualiza successChangeNIPStatus', async () => {
    const state: Partial<AuthState> = { loading: false, successChangeNIPStatus: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const get: Get = () => state as AuthState
    await changeNipStatusByIdUser(1, set, get)
    expect(state.successChangeNIPStatus).toBe(true)
  })
})
