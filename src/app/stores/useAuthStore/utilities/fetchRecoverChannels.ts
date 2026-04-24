'use client'

import type { RecoverChannel } from '@/app/mappings/auth/auth.types'
import { RecoverChannelsMap } from '@/app/mappings/auth/auth.mapper'
import { AuthRecoverChannels } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Set } from '../types'

export const fetchRecoverChannels = async (
  set: Set,
  email: string,
): Promise<RecoverChannel[] | null> => {
  set({
    loading: true,
    error: undefined,
    fetchingRecoverChannels: true,
    successRecoverChannels: false,
  })

  try {
    const get = pGet(requireGateway('get'))
    const response = await get(
      `${AuthRecoverChannels}?email=${encodeURIComponent(email)}`,
    )
    const channels = RecoverChannelsMap(response.data)

    set({
      loading: false,
      fetchingRecoverChannels: false,
      successRecoverChannels: true,
      recoverChannels: channels,
    })

    return channels
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      loading: false,
      fetchingRecoverChannels: false,
      successRecoverChannels: false,
      recoverChannels: [],
    })

    return null
  }
}
