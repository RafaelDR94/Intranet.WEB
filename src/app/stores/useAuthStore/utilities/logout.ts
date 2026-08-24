'use client'
import type { Set } from '../types'

import { setInterceptor } from './interceptor'

import type { User } from '@/app/context/AuthContext/types'
import { logoutUser } from '@/app/context/AuthContext/utilities/AuthService'
import { logoutBackendSession } from '@/app/services/auth/FirebaseSessionService'

export const logout = async (set: Set): Promise<void> => {
  try {
    await logoutBackendSession()
  } catch (error) {
    // El logout de Firebase y la limpieza local no pueden depender del backend.
    console.error('No se pudo cerrar la sesión remota del backend:', error)
  }

  try {
    await logoutUser()
  } catch (error) {
    console.error('No se pudo limpiar la sesión local:', error)
  }
  const REMEMBER_EMAIL_KEY = 'drs.remember.email'
  const REMEMBER_PASS_KEY = 'drs.remember.password'
  const REMEMBER_FLAG_KEY = 'drs.remember.flag'
  const rememberFlag = localStorage.getItem(REMEMBER_FLAG_KEY)
  const rememberedEmailLS = localStorage.getItem(REMEMBER_EMAIL_KEY)
  const rememberedPassLS = localStorage.getItem(REMEMBER_PASS_KEY)
  const firebaseToken = localStorage.getItem('firebaseTokenDoc')
  const deviceId = localStorage.getItem('deviceIdDoc')
  const tutorialProgress = localStorage.getItem('tutorialProgress:v1')
  set({ user: null, token: null, firebaseSessionStatus: 'idle' })
  setInterceptor(null)
  localStorage.clear()
  if (firebaseToken) localStorage.setItem('firebaseTokenDoc', firebaseToken)
  if (deviceId) localStorage.setItem('deviceIdDoc', deviceId)
  if (tutorialProgress) localStorage.setItem('tutorialProgress:v1', tutorialProgress)
  if (rememberFlag === '1' && rememberedEmailLS) {
    localStorage.setItem(REMEMBER_FLAG_KEY, '1')
    localStorage.setItem(REMEMBER_EMAIL_KEY, rememberedEmailLS)
    if (rememberedPassLS) localStorage.setItem(REMEMBER_PASS_KEY, rememberedPassLS)
    const rememberedUser = { email: rememberedEmailLS } as unknown as User
    set({ remeberMe: true, userRemebered: rememberedUser })
  } else {
    localStorage.removeItem(REMEMBER_FLAG_KEY)
    localStorage.removeItem(REMEMBER_EMAIL_KEY)
    localStorage.removeItem(REMEMBER_PASS_KEY)
    set({ remeberMe: false, userRemebered: null })
  }
  sessionStorage.clear()
}
