'use client'

import { PasskeyService } from '@/app/services/passkeys/PasskeyService'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'

import type { Get, Set } from '../types'

export const registerUserPasskeyOptions = async (
  set: Set,
  get: Get,
  deviceName: string,
): Promise<boolean> => {
  set({
    registeringUserPasskey: true,
    successRegisterUserPasskey: false,
    error: undefined,
  })

  try {
    await PasskeyService.registerPasskey(deviceName)
    const userId = get().user?.idUser
    if (userId) {
      await Promise.all([
        get().fetchUserPasskeys(userId),
        get().fetchUserMfaById(userId),
      ])
    }

    set({
      registeringUserPasskey: false,
      successRegisterUserPasskey: true,
    })

    return true
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      registeringUserPasskey: false,
      successRegisterUserPasskey: false,
    })

    return false
  }
}
