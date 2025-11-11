'use client'
import type { Set, Get, ChangePasswordPayload } from '../types'

import { AuthChangePassword } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const changePassword = async (
  set: Set,
  get: Get,
  payload: ChangePasswordPayload
): Promise<void> => {
  set({ loading: true, error: undefined, successChangePassword: false })
  try {
    const put = pPut(requireGateway('put'))
    await put(AuthChangePassword, payload)
    const currentUser = get().user
    const updatedUser = currentUser ? { ...currentUser, password: payload.newPassword } : currentUser

    set({
      loading: false,
      successChangePassword: true,
      user: updatedUser ?? null,
    })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successChangePassword: false })
  }
}
