'use client'
import type { Get, MfaPayload, Set } from '../types'

import { mapUserMfaPayload } from '@/app/mappings/users/user.mapper'
import { UsersMfa } from '@/app/configurations/Axios/urls'
import { saveLastUserRemebered, saveUser } from '@/app/context/AuthContext/utilities/AuthService'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const changeMfaStatus = async (
  set: Set,
  get: Get,
  payload: MfaPayload
): Promise<void> => {
  set({ changingMFA: true, error: undefined, successChangeMFA: false })

  try {
    const mapped = mapUserMfaPayload(payload)
    const put = pPut(requireGateway('put'))
    await put(UsersMfa, mapped)

    const { user, userRemebered } = get()
    const shouldUpdateUser = user?.idUser === mapped.idUser
    const shouldUpdateRememberedUser = userRemebered?.idUser === mapped.idUser

    const updatedUser =
      shouldUpdateUser && user
        ? { ...user, twoFactorEnabled: mapped.twoFactorEnabled }
        : user ?? null

    const updatedRememberedUser =
      shouldUpdateRememberedUser && userRemebered
        ? { ...userRemebered, twoFactorEnabled: mapped.twoFactorEnabled }
        : userRemebered ?? null
    const currentUserMfa = get().userMfaById

    set({
      changingMFA: false,
      successChangeMFA: true,
      user: updatedUser,
      userRemebered: updatedRememberedUser,
      userMfaById: currentUserMfa
        ? {
            ...currentUserMfa,
            twoFactorEnabled: mapped.twoFactorEnabled,
          }
        : null,
    })

    const persistenceTasks: Promise<unknown>[] = []

    if (updatedUser) {
      persistenceTasks.push(saveUser(updatedUser))
    }

    if (updatedRememberedUser) {
      persistenceTasks.push(saveLastUserRemebered(updatedRememberedUser))
    }

    if (persistenceTasks.length > 0) {
      await Promise.allSettled(persistenceTasks)
    }
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      changingMFA: false,
      successChangeMFA: false,
    })
  }
}
