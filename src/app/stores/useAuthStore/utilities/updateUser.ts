'use client'
import type { Set, Get } from '../types'
import type { User } from '@/app/context/AuthContext/types'
import { saveUser, saveLastUserRemebered } from '@/app/context/AuthContext/utilities/AuthService'

export const updateUser = async (
  set: Set,
  _get: Get,
  user: User
): Promise<void> => {
  await saveUser(user)
  await saveLastUserRemebered(user)
  set({ user })
}
