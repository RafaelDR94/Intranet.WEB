'use client'
import type { Get, ResetPasswordRecoveryPayload, Set } from '../types'

import {
  PostResetPasswordRecoveryMap,
  ResetPasswordRecoveryResponseMap,
} from '@/app/mappings/auth/auth.mapper'
import type { ResetPasswordRecoveryResponse } from '@/app/mappings/auth/auth.types'
import { AuthPasswordRecoveryResetPassword } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import {
  buildMockResetPasswordRecoveryResponse,
  isPasswordRecoveryMockEnabled,
} from './passwordRecoveryMock'

export const resetPasswordRecovery = async (
  set: Set,
  _get: Get,
  payload: ResetPasswordRecoveryPayload,
): Promise<ResetPasswordRecoveryResponse | null> => {
  set({
    loading: true,
    error: undefined,
    resettingPasswordRecovery: true,
    successResetPasswordRecovery: false,
    passwordRecoveryResetResponse: undefined,
  })

  try {
    if (isPasswordRecoveryMockEnabled()) {
      const response = buildMockResetPasswordRecoveryResponse(payload)

      set({
        loading: false,
        resettingPasswordRecovery: false,
        successResetPasswordRecovery: true,
        passwordRecoveryResetResponse: response,
      })

      return response
    }

    const post = pPost(requireGateway('post'))
    const response = await post(
      AuthPasswordRecoveryResetPassword,
      PostResetPasswordRecoveryMap(payload),
    )
    const resetResponse = ResetPasswordRecoveryResponseMap(response.data)

    set({
      loading: false,
      resettingPasswordRecovery: false,
      successResetPasswordRecovery: true,
      passwordRecoveryResetResponse: resetResponse,
    })

    return resetResponse
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      loading: false,
      resettingPasswordRecovery: false,
      successResetPasswordRecovery: false,
      passwordRecoveryResetResponse: undefined,
    })

    return null
  }
}
