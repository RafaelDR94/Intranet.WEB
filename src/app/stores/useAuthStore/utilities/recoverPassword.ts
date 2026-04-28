'use client'
import type { Set, Get, RecoverPasswordPayload } from '../types'

import {
  PostRecoverPasswordChallengeStartMap,
  RecoverPasswordChallengeStartResponseMap,
} from '@/app/mappings/recoverPassword/recoverPassword.mapper'
import type { RecoverPasswordResponse } from '@/app/mappings/auth/auth.types'
import { AuthChallengeStart } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPost } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import {
  buildMockRecoverPasswordResponse,
  isPasswordRecoveryMockEnabled,
} from './passwordRecoveryMock'

export const recoverPassword = async (
  set: Set,
  get: Get,
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
    const state = get()
    const postPayload = PostRecoverPasswordChallengeStartMap({
      purpose: 'PasswordRecovery',
      ...payload,
      challengeId: payload.challengeId ?? state.recoverPasswordChallenge?.challengeId,
      idUser:
        payload.idUser ??
        state.user?.idUser ??
        state.userRemebered?.idUser,
    })
    const response = await post(
      AuthChallengeStart,
      postPayload,
    )
    const challenge = RecoverPasswordChallengeStartResponseMap(response.data)

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
