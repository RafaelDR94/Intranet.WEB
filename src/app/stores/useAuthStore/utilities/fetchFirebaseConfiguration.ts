'use client'
import type { AxiosResponse } from 'axios'

import type { Set, FirebaseConfiguration } from '../types'

import { AuthFirebaseConfiguration } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchFirebaseConfiguration = async (set: Set): Promise<void> => {
  set({ loading: true, error: undefined, successFirebaseConfig: false })
  try {
    const getFn = pGet(requireGateway('get'))
    const res: AxiosResponse<FirebaseConfiguration> = await getFn(AuthFirebaseConfiguration)
    set({ firebaseConfig: res.data, loading: false, successFirebaseConfig: true })
  } catch (e) {
    set({ error: normalizeApiError(e).message, loading: false, successFirebaseConfig: false })
  }
}
