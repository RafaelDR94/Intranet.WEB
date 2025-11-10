'use client'
import type { Get, Set, SignaturePayload } from '../types'
import type { User } from '@/app/context/AuthContext/types'

import { UsersSignature } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'
import { saveLastUserRemebered, saveUser } from '@/app/context/AuthContext/utilities/AuthService'

export const changeSignature = async (
  set: Set,
  get: Get,
  payload: SignaturePayload
): Promise<void> => {
  set({
    signature: payload?.signature,
    changingSignature: true,
    error: undefined,
    succesChangeSignature: false,
  })
  try {
    const put = pPut(requireGateway('put'))
    await put(UsersSignature, payload);

    let nextUser: User | null = null
    let nextRemembered: User | null = null

    set((state) => {
      nextUser = state.user ? { ...state.user, signature: payload.signature } : null
      nextRemembered = state.userRemebered
        ? { ...state.userRemebered, signature: payload.signature }
        : null

      return {
        signature: payload.signature,
        user: nextUser ?? state.user,
        userRemebered: nextRemembered ?? state.userRemebered,
        succesChangeSignature: true,
        error: undefined,
        changingSignature: false,
      }
    })

    const { remeberMe } = get()

    if (nextUser) {
      await saveUser(nextUser)
    }

    if (remeberMe && nextRemembered) {
      await saveLastUserRemebered(nextRemembered)
    }
  } catch (e) {
    set({ error: normalizeApiError(e).message, changingSignature: false, succesChangeSignature: false })
  }
}
