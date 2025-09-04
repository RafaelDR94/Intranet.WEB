import { describe, it, expect, vi } from 'vitest'
import { handleForgetUser } from './handleForgetUser'
import type { AuthState, Set } from '../types'
import { forgetUser } from '@/app/context/AuthContext/utilities/AuthService'

vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  forgetUser: vi.fn(),
}))

describe('handleForgetUser util', () => {
  it('borra credenciales recordadas', async () => {
    const state: Partial<AuthState> = { remeberMe: true, userRemebered: {} as any }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    localStorage.setItem('drs.remember.flag', '1')
    localStorage.setItem('drs.remember.email', 'a')
    localStorage.setItem('drs.remember.password', 'p')
    await handleForgetUser(set)
    expect(forgetUser).toHaveBeenCalled()
    expect(state.remeberMe).toBe(false)
    expect(state.userRemebered).toBeNull()
    expect(localStorage.getItem('drs.remember.flag')).toBeNull()
    expect(localStorage.getItem('drs.remember.email')).toBeNull()
    expect(localStorage.getItem('drs.remember.password')).toBeNull()
  })
})
