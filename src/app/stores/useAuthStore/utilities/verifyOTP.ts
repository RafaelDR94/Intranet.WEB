'use client'
import type { Set, Get } from '../types'
import { validateOTP, readUser } from '@/app/context/AuthContext/utilities/AuthService'
import { setInterceptor } from './interceptor'

export const verifyOTP = async (
  set: Set,
  get: Get,
  optcode: string
): Promise<void> => {
  await validateOTP(get().token ?? '', optcode)
  const userDoc = await readUser()
  if (userDoc) {
    set({ user: userDoc.user, token: userDoc.user.token })
    setInterceptor(userDoc.user.token)
  }
}
