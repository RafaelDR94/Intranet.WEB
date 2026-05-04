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
import type { User } from '@/app/context/AuthContext/types'
import { saveUser } from '@/app/context/AuthContext/utilities/AuthService'
import { setInterceptor } from './interceptor'

const isUserLike = (value: unknown): value is User => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const source = value as Record<string, unknown>
  return typeof source.token === 'string' && source.token.length > 0
}

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
    const maybeUser = isUserLike(verification.data) ? verification.data : null
    const normalizedUser = maybeUser
      ? ({
          ...maybeUser,
          treeFirebase:
            typeof maybeUser.treeFirebase === 'string'
              ? maybeUser.treeFirebase
              : JSON.stringify(maybeUser.treeFirebase ?? {}),
        } as User)
      : null
    const token =
      normalizedUser?.token ??
      (typeof verification.data?.token === 'string'
        ? verification.data.token
        : typeof verification.data?.accessToken === 'string'
          ? verification.data.accessToken
          : null)

    if (verification.verified && normalizedUser && token) {
      try {
        await saveUser(normalizedUser)
        setInterceptor(token)
      } catch {
        // no-op: no bloquear el flujo de login MFA por persistencia local
      }
    }

    set({
      loading: false,
      verifyingAuthChallenge: false,
      successAuthChallengeVerification: true,
      authChallengeVerification: verification,
      ...(verification.verified &&
      normalizedUser &&
      token
        ? { user: normalizedUser, token, successLogin: true }
        : {}),
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
