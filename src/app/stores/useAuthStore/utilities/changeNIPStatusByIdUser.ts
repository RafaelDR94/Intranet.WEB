'use client'
import { AuthChangeNIPStatusByIdUser } from '@/app/configurations/Axios/urls'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import type { Set, Get } from '../types'

export const changeNipStatusByIdUser = async (
  id: number,
  set: Set,
  get: Get
): Promise<void> => {
  set({ loading: true, error: undefined, successChangeNIPStatus: false })
  try {
    const put = pPut(requireGateway('put'))
    await put(`${AuthChangeNIPStatusByIdUser}/${id}`, {})
    set({ loading: false, successChangeNIPStatus: true })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successChangeNIPStatus: false })
  }
}
