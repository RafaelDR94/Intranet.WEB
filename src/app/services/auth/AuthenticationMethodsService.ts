'use client'

import { AuthRecoverChannels } from '@/app/configurations/Axios/urls'
import { AuthenticationMethodsMap } from '@/app/mappings/auth/auth.mapper'
import type { AuthenticationMethod } from '@/app/mappings/auth/auth.types'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pGet } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const fetchAuthenticationMethods = async (
  email: string,
): Promise<AuthenticationMethod[]> => {
  try {
    const get = pGet(requireGateway('get'))
    const response = await get(
      `${AuthRecoverChannels}?email=${encodeURIComponent(email)}`,
    )

    return AuthenticationMethodsMap(response.data)
  } catch (error) {
    throw new Error(normalizeApiError(error).message)
  }
}
