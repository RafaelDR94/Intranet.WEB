'use client'

import type { UserMfaByIdResponse } from '@/app/mappings/users/user.types'
import { mapUserMfaByIdResponse } from '@/app/mappings/users/user.mapper'
import { UsersMfaById } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

import type { Set } from '../types'

export const fetchUserMfaById = async (
  set: Set,
  idUser: string,
): Promise<UserMfaByIdResponse | null> => {
  set({
    loading: true,
    error: undefined,
    fetchingUserMfaById: true,
    successUserMfaById: false,
  })

  try {
    const get = pGet(requireGateway('get'))
    const response = await get(`${UsersMfaById}/${encodeURIComponent(idUser)}`)
    const mfaData = mapUserMfaByIdResponse(response.data)

    const smsMethod = mfaData.methods.find((method) => method.method === 'SMS')
    const emailMethod = mfaData.methods.find((method) => method.method === 'Email')

    set({
      loading: false,
      fetchingUserMfaById: false,
      successUserMfaById: true,
      userMfaById: mfaData,
      mfaSmsEnabled: Boolean(smsMethod?.isEnabled),
      mfaEmailEnabled: Boolean(emailMethod?.isEnabled),
    })

    return mfaData
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      loading: false,
      fetchingUserMfaById: false,
      successUserMfaById: false,
      userMfaById: null,
    })

    return null
  }
}
