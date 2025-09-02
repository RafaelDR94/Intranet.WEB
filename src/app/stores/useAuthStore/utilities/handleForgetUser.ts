'use client'
import type { Set } from '../types'
import { forgetUser } from '@/app/context/AuthContext/utilities/AuthService'

export const handleForgetUser = async (set: Set): Promise<void> => {
  await forgetUser()
  set({ remeberMe: false, userRemebered: null })
  try {
    localStorage.removeItem('drs.remember.flag')
    localStorage.removeItem('drs.remember.email')
    localStorage.removeItem('drs.remember.password')
  } catch { /* noop */ }
}
