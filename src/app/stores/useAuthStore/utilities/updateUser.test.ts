import { describe, it, expect, vi } from 'vitest'
import { updateUser } from './updateUser'
import type { AuthState, Set, Get } from '../types'
import type { User } from '@/app/context/AuthContext/types'
import { saveUser, saveLastUserRemebered } from '@/app/context/AuthContext/utilities/AuthService'

vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  saveUser: vi.fn(),
  saveLastUserRemebered: vi.fn(),
}))

describe('updateUser util', () => {
  it('guarda usuario y actualiza estado', async () => {
    const state: Partial<AuthState> = { user: null }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    const user = { token: 'tok' } as User
    await updateUser(set, null as unknown as Get, user)
    expect(saveUser).toHaveBeenCalledWith(user)
    expect(saveLastUserRemebered).toHaveBeenCalledWith(user)
    expect(state.user).toBe(user)
  })
})
