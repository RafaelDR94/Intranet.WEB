'use client'
import type { Get, Set, VerifyAuthChallengePayload } from '../types'

import {
  AuthChallengeVerifyResponseMap,
  PostAuthChallengeVerifyMap,
} from '@/app/mappings/auth/auth.mapper'
import type { AuthChallengeVerifyResponse } from '@/app/mappings/auth/auth.types'
import { AuthChallengeVerify } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

export const verifyAuthChallenge = async (
  set: Set,
  _get: Get,
  payload: VerifyAuthChallengePayload,
): Promise<AuthChallengeVerifyResponse | null> => {
  set({
    loading: true,
    error: undefined,
    verifyingAuthChallenge: true,
    successAuthChallengeVerification: false,
    authChallengeVerification: undefined,
  })

  try {
    const post = pPost(requireGateway('post'))
    const response = await post(
      AuthChallengeVerify,
      PostAuthChallengeVerifyMap(payload),
    )
    const verification = AuthChallengeVerifyResponseMap(response.data)

    set({
      loading: false,
      verifyingAuthChallenge: false,
      successAuthChallengeVerification: true,
      authChallengeVerification: verification,
    })

    return verification
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      loading: false,
      verifyingAuthChallenge: false,
      successAuthChallengeVerification: false,
      authChallengeVerification: undefined,
    })

    return null
  }
}
