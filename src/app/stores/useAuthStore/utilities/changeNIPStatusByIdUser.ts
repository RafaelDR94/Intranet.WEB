'use client'
import type { Set } from '../types'

import { AuthChangeNIPStatusByIdUser } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const changeNipStatusByIdUser = async (
  id: number,
  set: Set,
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
