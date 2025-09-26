'use client'
import type { Set } from '../types'

import { setInterceptor } from './interceptor'

import type { User } from '@/app/context/AuthContext/types'
import { logoutUser } from '@/app/context/AuthContext/utilities/AuthService'

export const logout = async (set: Set): Promise<void> => {
  await logoutUser()
  const REMEMBER_EMAIL_KEY = 'drs.remember.email'
  const REMEMBER_PASS_KEY = 'drs.remember.password'
  const REMEMBER_FLAG_KEY = 'drs.remember.flag'
  const rememberFlag = localStorage.getItem(REMEMBER_FLAG_KEY)
  const rememberedEmailLS = localStorage.getItem(REMEMBER_EMAIL_KEY)
  const rememberedPassLS = localStorage.getItem(REMEMBER_PASS_KEY)
  const firebaseToken = localStorage.getItem('firebaseTokenDoc')
  const deviceId = localStorage.getItem('deviceIdDoc')
  set({ user: null, token: null })
  setInterceptor(null)
  localStorage.clear()
  if (firebaseToken) localStorage.setItem('firebaseTokenDoc', firebaseToken)
  if (deviceId) localStorage.setItem('deviceIdDoc', deviceId)
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
