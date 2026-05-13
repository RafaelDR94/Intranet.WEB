'use client'
import type { Get, MfaMethodPayload, Set } from '../types'

import { mapUserMfaMethodPayload } from '@/app/mappings/users/user.mapper'
import { UsersMfaMethod } from '@/app/configurations/Axios/urls'
import { normalizeApiError } from '@/app/utilities/Http/normalizeApiError'
import { pPut } from '@/app/utilities/Http/promisifyIntranet'
import { requireGateway } from '@/app/utilities/Http/requireGateway'

const isMfaChannelMethod = (method: string) => method === 'SMS' || method === 'Email'

export const changeMfaMethodStatus = async (
  set: Set,
  get: Get,
  payload: MfaMethodPayload
): Promise<void> => {
  set({ changingMFAMethod: true, error: undefined, successChangeMFAMethod: false })

  try {
    const mapped = mapUserMfaMethodPayload(payload)
    const put = pPut(requireGateway('put'))
    await put(UsersMfaMethod, mapped)

    const currentMfa = get().userMfaById
    const normalizedMethod =
      mapped.method === 'SMS' ? 'SMS' : mapped.method === 'Passkey' ? 'Passkey' : 'Email'
    const nextMethods = currentMfa
      ? currentMfa.methods.map((method) =>
          method.method === normalizedMethod
            ? { ...method, isEnabled: mapped.isEnabled }
            : method,
        )
      : null
    const nextTwoFactorEnabled =
      nextMethods?.some(
        (method) => isMfaChannelMethod(method.method) && method.isEnabled,
      ) ?? currentMfa?.twoFactorEnabled ?? false

    set({
      changingMFAMethod: false,
      successChangeMFAMethod: true,
      ...(mapped.method === 'SMS'
        ? { mfaSmsEnabled: mapped.isEnabled }
        : mapped.method === 'Email'
          ? { mfaEmailEnabled: mapped.isEnabled }
          : {}),
      userMfaById: currentMfa
        ? {
            ...currentMfa,
            twoFactorEnabled: nextTwoFactorEnabled,
            methods: nextMethods ?? currentMfa.methods,
          }
        : null,
    })
  } catch (e) {
    set({
      error: normalizeApiError(e).message,
      changingMFAMethod: false,
      successChangeMFAMethod: false,
    })
  }
}
