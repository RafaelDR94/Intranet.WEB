'use client'
import type { Set, Get, VerifyPasswordRecoverySmsPayload } from '../types'

import {
  PasswordRecoveryVerificationResponseMap,
  PostVerifyPasswordRecoverySmsMap,
} from '@/app/mappings/auth/auth.mapper'
import type { PasswordRecoveryVerificationResponse } from '@/app/mappings/auth/auth.types'
import { AuthPasswordRecoveryVerifySms } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import {
  buildMockPasswordRecoveryVerificationResponse,
  isPasswordRecoveryMockEnabled,
} from './passwordRecoveryMock'

export const verifyPasswordRecoverySms = async (
  set: Set,
  _get: Get,
  payload: VerifyPasswordRecoverySmsPayload,
): Promise<PasswordRecoveryVerificationResponse | null> => {
  set({
    loading: true,
    error: undefined,
    verifyingPasswordRecovery: true,
    successPasswordRecoveryVerification: false,
    passwordRecoveryVerification: undefined,
  })

  try {
    if (isPasswordRecoveryMockEnabled()) {
      const response = buildMockPasswordRecoveryVerificationResponse(payload)
      set({
        loading: false,
        verifyingPasswordRecovery: false,
        successPasswordRecoveryVerification: true,
        passwordRecoveryVerification: response,
      })
      return response
    }

    const post = pPost(requireGateway('post'))
    const response = await post(
      AuthPasswordRecoveryVerifySms,
      PostVerifyPasswordRecoverySmsMap(payload),
    )
    const verification = PasswordRecoveryVerificationResponseMap(response.data)

    set({
      loading: false,
      verifyingPasswordRecovery: false,
      successPasswordRecoveryVerification: true,
      passwordRecoveryVerification: verification,
    })

    return verification
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      loading: false,
      verifyingPasswordRecovery: false,
      successPasswordRecoveryVerification: false,
      passwordRecoveryVerification: undefined,
    })

    return null
  }
}
