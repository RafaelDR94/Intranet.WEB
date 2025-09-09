'use client'
import type { Set } from '../types'

import { forgetUser } from '@/app/context/AuthContext/utilities/AuthService'

export const handleRemeberMe = async (
  set: Set,
  rememberme: boolean
): Promise<void> => {
  set({ remeberMe: rememberme })
  if (!rememberme) {
    try {
      await forgetUser()
      set({ userRemebered: null })
    } catch { /* noop */ }
    try {
      localStorage.removeItem('drs.remember.flag')
      localStorage.removeItem('drs.remember.email')
      localStorage.removeItem('drs.remember.password')
    } catch { /* noop */ }
  }
}
