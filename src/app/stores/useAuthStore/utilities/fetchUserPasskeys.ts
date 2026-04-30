'use client'

import type { UserPasskeyResponse } from '@/app/mappings/users/user.types'
import { mapUserPasskeysResponse } from '@/app/mappings/users/user.mapper'
import { AuthPasskeysByUser } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Set } from '../types'

export const fetchUserPasskeys = async (
  set: Set,
  idUser: string,
): Promise<UserPasskeyResponse[] | null> => {
  set({
    loading: true,
    error: undefined,
    fetchingUserPasskeys: true,
    successUserPasskeys: false,
  })

  try {
    const get = pGet(requireGateway('get'))
    const response = await get(`${AuthPasskeysByUser}/${encodeURIComponent(idUser)}`)
    const passkeys = mapUserPasskeysResponse(response.data)

    set({
      loading: false,
      fetchingUserPasskeys: false,
      successUserPasskeys: true,
      userPasskeys: passkeys,
    })

    return passkeys
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      loading: false,
      fetchingUserPasskeys: false,
      successUserPasskeys: false,
      userPasskeys: [],
    })

    return null
  }
}
