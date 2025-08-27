'use client'
import type { AxiosResponse } from 'axios'
import { LoginUrl } from '@/app/configurations/Axios/urls'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import type { Set, Get, LoginPayload, LoginResponse } from '../types'

export const login = async (set: Set, get: Get, payload: LoginPayload): Promise<void> => {
  set({ loading: true, error: undefined, successLogin: false })
  try {
    const post = pPost(requireGateway('post'))
    const res: AxiosResponse<LoginResponse> = await post(LoginUrl, payload)
    set({ loginData: res.data, loading: false, successLogin: true })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successLogin: false })
  }
}
