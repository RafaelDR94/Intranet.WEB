import { describe, it, expect } from 'vitest'
import { validLoggin } from './validLoggin'
import type { AuthState, Set, Get } from '../types'
import type { User } from '@/app/context/AuthContext/types'

describe('validLoggin util', () => {
  it('marca expiración si el token caducó', async () => {
    const state: Partial<AuthState> = {}
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const user = { lifeToken: new Date(Date.now() - 1000).toISOString() } as unknown as User
    const get: Get = () => ({ user, offlineMode: false } as AuthState)
    const result = await validLoggin(set, get)
    expect(result).toBe(false)
    expect(state.hasExpired).toBe(true)
  })

  it('retorna true cuando token es válido', async () => {
    const set: Set = () => undefined
    const user = { lifeToken: new Date(Date.now() + 100000).toISOString() } as unknown as User
    const get: Get = () => ({ user, offlineMode: false } as AuthState)
    const result = await validLoggin(set, get)
    expect(result).toBe(true)
  })
})
