'use client'
import type { Set, Get, RecoverPasswordPayload } from '../types'

import { AuthRecoverPassword } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const recoverPassword = async (
  set: Set,
  get: Get,
  payload: RecoverPasswordPayload
): Promise<void> => {
  set({ loading: true, error: undefined, successRecoverPassword: false })
  try {
    const put = pPut(requireGateway('put'))
    await put(`${AuthRecoverPassword}?username=${encodeURIComponent(payload.username)}`, {})
    set({ loading: false, successRecoverPassword: true })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successRecoverPassword: false })
  }
}
