import { describe, it, expect, vi, beforeEach } from 'vitest'
import { handleRemeberMe } from './handleRemeberMe'
import type { AuthState, Set } from '../types'
import { forgetUser } from '@/app/context/AuthContext/utilities/AuthService'

vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  forgetUser: vi.fn(),
}))

describe('handleRemeberMe util', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('limpia almacenamiento cuando se desactiva', async () => {
    const state: Partial<AuthState> = { remeberMe: true, userRemebered: {} as any }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    localStorage.setItem('drs.remember.flag', '1')
    localStorage.setItem('drs.remember.email', 'a')
    localStorage.setItem('drs.remember.password', 'p')
    await handleRemeberMe(set, false)
    expect(forgetUser).toHaveBeenCalled()
    expect(state.remeberMe).toBe(false)
    expect(state.userRemebered).toBeNull()
    expect(localStorage.getItem('drs.remember.flag')).toBeNull()
  })

  it('actualiza bandera sin borrar datos cuando se activa', async () => {
    const state: Partial<AuthState> = { remeberMe: false }
    const set: Set = (partial) => Object.assign(state, typeof partial === 'function' ? partial(state as AuthState) : partial)
    await handleRemeberMe(set, true)
    expect(state.remeberMe).toBe(true)
    expect(forgetUser).not.toHaveBeenCalled()
  })
})
