'use client'
import type { Set, Get } from '../types'
import type { LoginCredentials } from '@/app/context/AuthContext/types'
import { authenticateUser, readUser, saveLastUserRemebered, forgetUser } from '@/app/context/AuthContext/utilities/AuthService'
import { setInterceptor } from './interceptor'

export const login = async (
  set: Set,
  get: Get,
  credentials: LoginCredentials
): Promise<void> => {
  set({ loading: true, error: undefined, hasExpired: false })
  try {
    await authenticateUser(credentials, get().remeberMe, get().offlineMode)
    const userDoc = await readUser()
    if (userDoc) {
      set({ user: userDoc.user, token: userDoc.user.token, successLogin: true })
      setInterceptor(userDoc.user.token)
    }
    try {
      const remember = get().remeberMe
      if (remember && userDoc?.user?.email) {
        await saveLastUserRemebered(userDoc.user)
        set({ userRemebered: userDoc.user })
      } else {
        await forgetUser()
        set({ userRemebered: null })
      }
    } catch { /* noop */ }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'login error'
    set({ error: message, successLogin: false })
    throw e
  } finally {
    set({ loading: false })
  }
}
