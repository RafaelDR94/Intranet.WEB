'use client'
import type { Set, Get, AuthValidatePayload } from '../types'

import { AuthValidate } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const authValidate = async (set: Set, get: Get, payload: AuthValidatePayload): Promise<void> => {
  set({ loading: true, error: undefined, successAuthValidate: false })
  try {
    const post = pPost(requireGateway('post'))
    await post(AuthValidate, payload)
    set({ loading: false, successAuthValidate: true })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successAuthValidate: false })
  }
}
