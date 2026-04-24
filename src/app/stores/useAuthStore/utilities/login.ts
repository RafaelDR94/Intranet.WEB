'use client'
import type { Set, Get } from '../types'

import { setInterceptor } from './interceptor'
import { fetchUserSignature } from './fetchUserSignature'

import type { LoginCredentials } from '@/app/context/AuthContext/types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import {
  authenticateUser,
  readUser,
  saveLastUserRemebered,
  forgetUser,
  saveUser,
} from '@/app/context/AuthContext/utilities/AuthService'

export const login = async (
  set: Set,
  get: Get,
  credentials: LoginCredentials
): Promise<void> => {
  set({ loading: true, error: undefined, hasExpired: false })
  try {
    await authenticateUser(credentials, get().remeberMe, get().offlineMode)
    const userDoc = await readUser()
    if (userDoc?.user) {
      let currentUser = userDoc.user
      let signature = currentUser.signature ?? ''

      set({
        user: currentUser,
        token: currentUser.token,
        successLogin: true,
        signature,
      })

      setInterceptor(currentUser.token)

      const remoteSignature = await fetchUserSignature({
        idEmployee: currentUser.idEmployee,
        idUser: currentUser.idUser,
      })

      if (remoteSignature !== null && remoteSignature !== signature) {
        signature = remoteSignature
        currentUser = { ...currentUser, signature }
        set({ signature, user: currentUser })
        await saveUser(currentUser)
      }

      try {
        const remember = get().remeberMe
        if (remember && currentUser.email) {
          await saveLastUserRemebered(currentUser)
          set({ userRemebered: currentUser })
        } else {
          await forgetUser()
          set({ userRemebered: null })
        }
      } catch { /* noop */ }

      return
    }

    try {
      await forgetUser()
      set({ userRemebered: null })
    } catch { /* noop */ }
  } catch (e: unknown) {
    const message = normalizeApiError(
      e,
      'No se logró acceder, revise sus datos e inténtelo de nuevo',
    ).message
    set({ error: message, successLogin: false })
    throw e
  } finally {
    set({ loading: false })
  }
}
