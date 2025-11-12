'use client'
import type { Set, Get, NipPayload } from '../types'

import { AuthChangeNIP } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { saveLastUserRemebered, saveUser } from '@/app/context/AuthContext/utilities/AuthService'

export const changeNip = async (
  set: Set,
  get: Get,
  payload: NipPayload
): Promise<void> => {
  set({ loading: true, error: undefined, successChangeNIP: false })
  try {
    const put = pPut(requireGateway('put'))
    await put(AuthChangeNIP, payload)

    const { user, userRemebered } = get()
    const shouldUpdateUser = user?.idUser === payload.user_id
    const shouldUpdateRememberedUser = userRemebered?.idUser === payload.user_id

    const updatedUser = shouldUpdateUser && user ? { ...user, nip: payload.nip } : user ?? null
    const updatedRememberedUser =
      shouldUpdateRememberedUser && userRemebered
        ? { ...userRemebered, nip: payload.nip }
        : userRemebered ?? null

    set({
      loading: false,
      successChangeNIP: true,
      user: updatedUser,
      userRemebered: updatedRememberedUser,
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
    set({ error: normalizeApiError(e).message, loading: false, successChangeNIP: false })
  }
}
