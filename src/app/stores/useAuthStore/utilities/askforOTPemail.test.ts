import { describe, it, expect, vi } from 'vitest'

// verifica que la utilidad reenvíe el token almacenado.
import { askforOTPemail } from './askforOTPemail'
import type { AuthState, Set, Get } from '../types'
import { sendOTPEmail } from '@/app/context/AuthContext/utilities/AuthService'

vi.mock('@/app/context/AuthContext/utilities/AuthService', () => ({
  sendOTPEmail: vi.fn(),
}))

describe('askforOTPemail util', () => {
  it('envía token al servicio', async () => {
    const state: Partial<AuthState> = { token: 'tok' }
    const set: Set = () => undefined
    const get: Get = () => state as AuthState
    await askforOTPemail(set, get)
    expect(sendOTPEmail).toHaveBeenCalledWith('tok')
  })
})
