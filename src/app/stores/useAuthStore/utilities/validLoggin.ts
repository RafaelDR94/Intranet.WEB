'use client'
import type { Set, Get } from '../types'

export const validLoggin = async (
  set: Set,
  get: Get
): Promise<boolean> => {
  const { user, offlineMode } = get()
  if (user) {
    const lifeTokenDate = new Date(user.lifeToken.replace('Z', ''))
    const currentDate = new Date()
    if (currentDate >= lifeTokenDate && !offlineMode) {
      set({ hasExpired: true })
      return false
    }
    return true
  }
  return false
}
