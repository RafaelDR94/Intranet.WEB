'use client'
import { AuthChangeNIP } from '@/app/configurations/Axios/urls'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import type { Set, Get, NipPayload } from '../types'

export const changeNip = async (
  set: Set,
  get: Get,
  payload: NipPayload
): Promise<void> => {
  set({ loading: true, error: undefined, successChangeNIP: false })
  try {
    const put = pPut(requireGateway('put'))
    await put(AuthChangeNIP, payload)
    set({ loading: false, successChangeNIP: true })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successChangeNIP: false })
  }
}
