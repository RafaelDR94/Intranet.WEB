'use client'
import type { Set, Get, RecoverPasswordPayload } from '../types'

import {
  PostRecoverPasswordMap,
  RecoverPasswordResponseMap,
} from '@/app/mappings/auth/auth.mapper'
import type { RecoverPasswordResponse } from '@/app/mappings/auth/auth.types'
import { AuthRecoverPassword } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import {
  buildMockRecoverPasswordResponse,
  isPasswordRecoveryMockEnabled,
} from './passwordRecoveryMock'

export const recoverPassword = async (
  set: Set,
  _get: Get,
  payload: RecoverPasswordPayload
): Promise<RecoverPasswordResponse | null> => {
  set({
    loading: true,
    error: undefined,
    recoveringPassword: true,
    successRecoverPassword: false,
    recoverPasswordRequest: payload,
    recoverPasswordChallenge: undefined,
  })

  try {
    if (isPasswordRecoveryMockEnabled()) {
      const challenge = buildMockRecoverPasswordResponse(payload)

      set({
        loading: false,
        recoveringPassword: false,
        successRecoverPassword: true,
        recoverPasswordChallenge: challenge,
      })

      return challenge
    }

    const post = pPost(requireGateway('post'))
    const response = await post(AuthRecoverPassword, PostRecoverPasswordMap(payload))
    const challenge = RecoverPasswordResponseMap(response.data)

    set({
      loading: false,
      recoveringPassword: false,
      successRecoverPassword: true,
      recoverPasswordChallenge: challenge,
    })

    return challenge
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      loading: false,
      recoveringPassword: false,
      successRecoverPassword: false,
      recoverPasswordChallenge: undefined,
    })

    return null
  }
}
