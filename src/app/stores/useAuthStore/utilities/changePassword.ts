'use client'
import { AuthChangePassword } from '@/app/configurations/Axios/urls'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import type { Set, Get, ChangePasswordPayload } from '../types'

export const changePassword = async (
  set: Set,
  get: Get,
  payload: ChangePasswordPayload
): Promise<void> => {
  set({ loading: true, error: undefined, successChangePassword: false })
  try {
    const put = pPut(requireGateway('put'))
    await put(AuthChangePassword, payload)
    set({ loading: false, successChangePassword: true })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successChangePassword: false })
  }
}
