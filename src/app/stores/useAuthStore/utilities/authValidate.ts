'use client'
import type { Set, AuthValidatePayload } from '../types'

import { AuthValidate } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const authValidate = async (set: Set, payload: AuthValidatePayload): Promise<void> => {
  set({ loading: true, error: undefined, successAuthValidate: false })
  try {
    const post = pPost(requireGateway('post'))
    const response = await post(AuthValidate, payload)
    const signature = response?.data?.data?.signature
    set({ loading: false, successAuthValidate: true,signature: signature})
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successAuthValidate: false,signature:"" })
  }
}
