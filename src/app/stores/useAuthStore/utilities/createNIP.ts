'use client'
import { AuthCreateNIP } from '@/app/configurations/Axios/urls'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import type { Set, Get, NipPayload } from '../types'

export const createNip = async (
  set: Set,
  get: Get,
  payload: NipPayload
): Promise<void> => {
  set({ loading: true, error: undefined, successCreateNIP: false })
  try {
    const post = pPost(requireGateway('post'))
    await post(AuthCreateNIP, payload)
    set({ loading: false, successCreateNIP: true })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successCreateNIP: false })
  }
}
