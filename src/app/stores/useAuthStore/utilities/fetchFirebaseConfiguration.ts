'use client'
import type { AxiosResponse } from 'axios'
import { AuthFirebaseConfiguration } from '@/app/configurations/Axios/urls'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import type { Set, Get, FirebaseConfiguration } from '../types'

export const fetchFirebaseConfiguration = async (set: Set, get: Get): Promise<void> => {
  set({ loading: true, error: undefined, successFirebaseConfig: false })
  try {
    const getFn = pGet(requireGateway('get'))
    const res: AxiosResponse<FirebaseConfiguration> = await getFn(AuthFirebaseConfiguration)
    set({ firebaseConfig: res.data, loading: false, successFirebaseConfig: true })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successFirebaseConfig: false })
  }
}
